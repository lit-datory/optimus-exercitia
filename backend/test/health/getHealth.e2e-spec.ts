import request from "supertest"
import { NestExpressApplication } from "@nestjs/platform-express"
import { bootstrapTestApp } from "src/utils/specs"

describe("GET /health", () => {
  let app: NestExpressApplication

  beforeEach(async () => {
    app = await bootstrapTestApp()
    await app.init()
  })

  it("returns 200", async () => {
    await request(app.getHttpServer()).get("/health").expect(200)
  })

  afterAll(async () => {
    await app.close()
  })
})
