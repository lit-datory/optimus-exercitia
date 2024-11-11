beforeAll(() => {
  const workerId = process.env.JEST_WORKER_ID

  if (!workerId) throw new Error("JEST_WORKER ID env variable not found")

  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL env variable not found")

  const schema = `test_schema_${workerId.toString()}`

  process.env.DATABASE_URL = `${process.env.DATABASE_URL}?schema=${schema}`
})
