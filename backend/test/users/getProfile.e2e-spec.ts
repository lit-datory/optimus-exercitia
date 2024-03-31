import request from "supertest"
import { INestApplication } from "@nestjs/common"
import { PrismaService } from "src/prisma"
import { bootstrapTestApp } from "src/utils/specs"
import { UserFactory } from "src/factories"
import { User } from "src/app"
import { BuildAccessTokenService } from "src/auth/services/buildAccessToken.service"

describe("GET /profile", () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let buildAccessTokenService: BuildAccessTokenService

  beforeEach(async () => {
    app = await bootstrapTestApp()
    userFactory = await app.resolve(UserFactory)
    prisma = await app.resolve(PrismaService)
    buildAccessTokenService = await app.resolve(BuildAccessTokenService)
    await app.init()
  })

  it("returns 200", async () => {
    const user = await userFactory.create()
    const accessToken = buildAccessTokenService.execute({ user })

    const response = await request(app.getHttpServer())
      .get("/profile")
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200)
    expect(response.body).toBeDefined()
  })

  it("returns 401 - authorization header not set", async () => {
    const response = await request(app.getHttpServer())
      .get("/profile")
      .expect(401)
    expect(response.body).toBeDefined()
  })

  it("returns 404 - user not found", async () => {
    const user = userFactory.build() as User
    const accessToken = buildAccessTokenService.execute({ user })

    const response = await request(app.getHttpServer())
      .get("/profile")
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(404)
    expect(response.body).toBeDefined()
  })

  afterEach(async () => await prisma.$truncateAll())
  afterAll(async () => await app.close())
})
