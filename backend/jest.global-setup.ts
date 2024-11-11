import { execSync } from "child_process"
import os from "os"

export default function globalSetup() {
  const cpuCores = os.cpus().length
  const schemas = Array.from({ length: cpuCores }).map((_, i) => {
    const workerNum = i + 1

    return `test_schema_${workerNum.toString()}`
  })

  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL env variable not found")

  for (const schema of schemas) {
    const databaseUrl = `${process.env.DATABASE_URL}?schema=${schema}`

    execSync(`export DATABASE_URL=${databaseUrl} && npx prisma migrate deploy`)
    // Optional: Seed the database for test data
  }
}
