import os from "os"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function globalTeardown() {
  const cpuCores = os.cpus().length
  const schemas = Array.from({ length: cpuCores }).map((_, i) => {
    const workerNum = i + 1

    return `test_schema_${workerNum.toString()}`
  })

  await Promise.all(
    schemas.map(async (schema) => {
      await prisma.$executeRawUnsafe(
        `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
      )
    }),
  )
  await prisma.$disconnect()
}
