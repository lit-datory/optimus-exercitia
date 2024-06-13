import { Context } from "aws-lambda"
import puppeteer, { Browser } from "puppeteer-core"
import aws from "aws-sdk"
import chromium from "@sparticuz/chromium"
import { PDFDocument } from "pdf-lib"

chromium.setHeadlessMode = true

// Initialize browser instance outside of handler to prevent instantiation every request cycle
let browser: Browser
async function initBrowser() {
  browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  })
}

export async function handler(event: { urls: string[] }, context: Context) {
  const urls = event.urls
  console.info("Generating PDF of ", urls)

  try {
    if (!browser) await initBrowser()

    const browserVersion = await browser.version()
    console.info(`Started ${browserVersion}`)

    const files = await generatePDFs(browser, urls)

    const pdfsBuffer = await mergePDFs(files)

    const s3 = new aws.S3()
    const key = `${context.awsRequestId}.pdf`
    await s3
      .putObject({
        Bucket: "puppeteerz",
        Key: key,
        Body: pdfsBuffer,
        ContentType: "pdf",
      })
      .promise()

    return {
      statusCode: 200,
      body: "success!",
    }
  } catch (err: unknown) {
    const error = err as Error
    console.error("ERROR: ", error)

    return {
      statusCode: 400,
      body: error.message,
    }
  }
}

async function generatePDFs(browser: Browser, urls: string[]) {
  const files = []

  for (const url of urls) {
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(30000)
    await page.goto(url, { waitUntil: "networkidle0" })
    const pdfBuffer = await page.pdf({ format: "A4", landscape: true })
    await page.close()
    files.push(pdfBuffer)
  }

  return files
}

async function mergePDFs(files: Buffer[]) {
  const mergedPdf = await PDFDocument.create()

  for (const file of files) {
    const pdf = await PDFDocument.load(file)
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    pages.forEach((page) => {
      mergedPdf.addPage(page)
    })
  }

  return await mergedPdf.save()
}
