import { PrismaClient } from "@prisma/client"

type Func = (db: PrismaClient) => Promise<void>
async function runWithDbConnection(func: Func): Promise<void> {
  const db = new PrismaClient()
  await db.$connect()
  await func(db)
  await db.$disconnect()
}

export function withDbConnection(func: Func): () => Promise<void> {
  return async (): Promise<void> => await runWithDbConnection(func)
}
