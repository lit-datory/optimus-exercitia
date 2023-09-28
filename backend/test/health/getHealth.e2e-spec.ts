import * as request from "supertest"
import { INestApplication } from "@nestjs/common"
import { bootstrapTestApp } from "src/utils/specs"

describe("GET /health", () => {
  let app: INestApplication

  beforeEach(async () => {
    app = await bootstrapTestApp()
    await app.init()
  })

  it("returns 200", async () => {
    await request(app.getHttpServer()).get("/health").expect(200)
  })

  afterAll(async () => await app.close())
})
