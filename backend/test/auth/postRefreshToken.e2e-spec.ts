import request from "supertest"
import { NestExpressApplication } from "@nestjs/platform-express"
import { bootstrapTestApp } from "src/utils/specs"
import { PrismaService } from "src/prisma"
import { RefreshTokenStateFactory } from "src/factories"
import { JwtService } from "@nestjs/jwt"
import { BuildRefreshTokenService } from "src/auth/services/buildRefreshToken.service"
import { BuildRefreshTokenCookieService } from "src/auth/services/buildRefreshTokenCookie.service"
import { BuildCsrfCookieService } from "src/auth/services/buildCsrfCookie.service"
import { BuildCsrfTokenService } from "src/auth/services/buildCsrfToken.service"

describe("POST /refresh_token", () => {
  let app: NestExpressApplication
  let prisma: PrismaService
  let refreshTokenStateFactory: RefreshTokenStateFactory
  let buildRefreshTokenService: BuildRefreshTokenService
  let buildRefreshTokenCookieService: BuildRefreshTokenCookieService
  let buildCsrfCookieService: BuildCsrfCookieService
  let buildCsrfTokenService: BuildCsrfTokenService
  let jwtService: JwtService

  beforeEach(async () => {
    app = await bootstrapTestApp()
    prisma = await app.resolve(PrismaService)
    refreshTokenStateFactory = await app.resolve(RefreshTokenStateFactory)
    buildRefreshTokenService = await app.resolve(BuildRefreshTokenService)
    buildRefreshTokenCookieService = await app.resolve(
      BuildRefreshTokenCookieService,
    )
    buildCsrfCookieService = await app.resolve(BuildCsrfCookieService)
    buildCsrfTokenService = await app.resolve(BuildCsrfTokenService)
    jwtService = await app.resolve(JwtService)
    await app.init()
  })

  it("returns 200", async () => {
    const refreshTokenState = await refreshTokenStateFactory.create()
    const refreshToken =
      await buildRefreshTokenService.execute(refreshTokenState)
    const csrfToken = buildCsrfTokenService.execute()
    const csrfCookie = buildCsrfCookieService.execute(csrfToken)
    const refreshTokenCookie =
      buildRefreshTokenCookieService.execute(refreshToken)
    await request(app.getHttpServer())
      .post("/auth/refresh_token")
      .set({ "X-CSRF-TOKEN": csrfToken })
      .set("Cookie", [csrfCookie, refreshTokenCookie])
      .expect(200)
  })

  it("returns 401 - refreshToken cookie missing", async () => {
    const csrfToken = buildCsrfTokenService.execute()
    const csrfCookie = buildCsrfCookieService.execute(csrfToken)

    await request(app.getHttpServer())
      .post("/auth/refresh_token")
      .set({ "X-CSRF-TOKEN": csrfToken })
      .set("Cookie", [csrfCookie])
      .expect(401)
  })

  it("returns 401 - refreshToken invalid", async () => {
    const csrfToken = buildCsrfTokenService.execute()
    const csrfCookie = buildCsrfCookieService.execute(csrfToken)
    const refreshTokenCookie = buildRefreshTokenCookieService.execute("invalid")

    await request(app.getHttpServer())
      .post("/auth/refresh_token")
      .set({ "X-CSRF-TOKEN": csrfToken })
      .set("Cookie", [csrfCookie, refreshTokenCookie])
      .expect(401)
  })

  it("returns 401 - refreshToken expired", async () => {
    const csrfToken = buildCsrfTokenService.execute()
    const csrfCookie = buildCsrfCookieService.execute(csrfToken)
    const refreshToken = await jwtService.signAsync(
      { sub: "1" },
      {
        expiresIn: "-1h",
      },
    )

    const refreshTokenCookie =
      buildRefreshTokenCookieService.execute(refreshToken)

    await request(app.getHttpServer())
      .post("/auth/refresh_token")
      .set({ "X-CSRF-TOKEN": csrfToken })
      .set("Cookie", [csrfCookie, refreshTokenCookie])
      .expect(401)
  })

  it("returns 401 - X-CSRF-TOKEN header missing", async () => {
    const csrfToken = buildCsrfTokenService.execute()
    const csrfCookie = buildCsrfCookieService.execute(csrfToken)
    await request(app.getHttpServer())
      .post("/auth/refresh_token")
      .set("Cookie", [csrfCookie])
      .expect(401)
  })

  afterEach(async () => { await prisma.$truncateAll(); })
  afterAll(async () => { await app.close(); })
})
