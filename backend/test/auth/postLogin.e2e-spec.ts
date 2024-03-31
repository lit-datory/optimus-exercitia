import request from "supertest"
import { INestApplication } from "@nestjs/common"
import { PrismaService } from "src/prisma"
import { bootstrapTestApp } from "src/utils/specs"
import { UserFactory } from "src/factories"

describe("POST /login", () => {
  let app: INestApplication
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

    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .set("user-agent", "test")
      .send({ password, email })
      .expect(200)
    expect(response.body.accessToken).toBeDefined()
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

  afterEach(async () => await prisma.$truncateAll())
  afterAll(async () => await app.close())
})
