import request from "supertest"
import { INestApplication } from "@nestjs/common"
import { bootstrapTestApp } from "src/utils/specs"

import { PrismaService } from "src/prisma"
import { RefreshTokenStateFactory, UserFactory } from "src/factories"
import { BuildRefreshTokenService } from "src/auth/services/buildRefreshToken.service"
import { BuildRefreshTokenCookieService } from "src/auth/services/buildRefreshTokenCookie.service"

describe("POST /logout", () => {
  let app: INestApplication
  let prisma: PrismaService
  let refreshTokenStateFactory: RefreshTokenStateFactory
  let userFactory: UserFactory
  let buildRefreshTokenService: BuildRefreshTokenService
  let buildRefreshTokenCookieService: BuildRefreshTokenCookieService

  beforeEach(async () => {
    app = await bootstrapTestApp()
    prisma = await app.resolve(PrismaService)
    userFactory = await app.resolve(UserFactory)
    refreshTokenStateFactory = await app.resolve(RefreshTokenStateFactory)
    buildRefreshTokenService = await app.resolve(BuildRefreshTokenService)
    buildRefreshTokenCookieService = await app.resolve(
      BuildRefreshTokenCookieService,
    )
    await app.init()
  })

  it("returns 200 - when refresh token is present", async () => {
    const user = await userFactory.create()
    const refreshTokenState = await refreshTokenStateFactory.create({
      userId: user.id,
    })
    const refreshToken =
      await buildRefreshTokenService.execute(refreshTokenState)
    const refreshTokenCookie =
      buildRefreshTokenCookieService.execute(refreshToken)
    await request(app.getHttpServer())
      .post("/auth/logout")
      .set("Cookie", [refreshTokenCookie])
      .expect(200)
  })

  it("returns 200 - when refresh token is mising", async () => {
    await request(app.getHttpServer()).post("/auth/logout").expect(200)
  })

  it("returns 200 - refresh token is invalid", async () => {
    const refreshTokenCookie = buildRefreshTokenCookieService.execute("invalid")
    await request(app.getHttpServer())
      .post("/auth/logout")
      .set("Cookie", [refreshTokenCookie])
      .expect(200)
  })

  afterEach(async () => await prisma.$truncateAll())
  afterAll(async () => await app.close())
})
