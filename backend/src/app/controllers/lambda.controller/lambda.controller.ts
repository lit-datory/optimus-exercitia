import { Body, Controller, Post } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { badRequestSchema, UseSchema } from "src/zod"
import { runLambdaBodySchema, runLambdaResponseSchema } from "./schemas"
import { RunLambdaBody } from "./types"
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda"

@ApiTags("Lambda")
@Controller("lambda")
export class LambdasController {
  constructor() {}

  @ApiOperation({ description: "Runs AWS lambda" })
  @UseSchema({
    body: runLambdaBodySchema,
    response: { 200: runLambdaResponseSchema, 400: badRequestSchema },
  })
  @Post()
  public async create(@Body() body: RunLambdaBody) {
    console.log("BODY", body)
    try {
      const client = new LambdaClient({
        credentials: {
          secretAccessKey: "",
          accessKeyId: "",
        },
        region: "eu-central-1",
        endpoint: "http://puppeteer-lambda:8080",
      })
      const command = new InvokeCommand({
        FunctionName: "function",
        Payload: JSON.stringify(body.event),
      })
      const { Payload } = await client.send(command)
      const result = Payload && Buffer.from(Payload).toString()
      console.log("RESULT: ", result)
    } catch (e: unknown) {
      console.error("E: ", e)
    }
  }
}
