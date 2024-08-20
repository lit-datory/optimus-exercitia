import request from "supertest"
import { NestExpressApplication } from "@nestjs/platform-express"
import { PrismaService } from "src/prisma"
import { bootstrapTestApp } from "src/utils/specs"
import { UserFactory } from "src/factories"
import { AuthResponse } from "src/auth/controllers/auth.controller/types"

describe("POST /login", () => {
  let app: NestExpressApplication
  let prisma: PrismaService
  let userFactory: UserFactory

  beforeEach(async () => {
    app = await bootstrapTestApp()
    userFactory = await app.resolve(UserFactory)
    prisma = await app.resolve(PrismaService)
    await app.init()
  })

  it("returns accessToken", async () => {
    const password = "test123"
    const { email } = await userFactory.create({ password })

    const response: { body: unknown } = await request(app.getHttpServer())
      .post("/auth/login")
      .set("user-agent", "test")
      .send({ password, email })
      .expect(200)

    expect(response.body).toMatchObject<AuthResponse>({
      accessToken: expect.anything() as string,
    })
  })

  it("returns 401 when password is wrong", async () => {
    const password = "test123"
    const { email } = await userFactory.create({ password })

    await request(app.getHttpServer())
      .post("/auth/login")
      .set("user-agent", "test")
      .send({ password: "test456", email })
      .expect(401)
  })

  it("returns 401 when user doesn't exist", async () => {
    const password = "test123"
    await userFactory.create({ password })

    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ password, email: "random@test.com" })
      .expect(401)
  })

  it("returns 400 when invalid data is given", async () => {
    await request(app.getHttpServer())
      .post("/auth/login")
      .set("user-agent", "test")
      .send({ password: "", email: "invalid" })
      .expect(400)
  })

  afterEach(async () => {
    await prisma.$truncateAll()
  })
  afterAll(async () => {
    await app.close()
  })
})
