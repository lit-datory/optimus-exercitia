import { PrismaService } from "src/prisma/prisma.service"
import { BuildRefreshTokenCookieService } from "./buildRefreshTokenCookie.service"
import { BuildRefreshTokenService } from "src/auth/services/buildRefreshToken.service"
import { bootstrapTestModule } from "src/utils/specs"
import { RefreshTokenStateFactory } from "src/factories"
import { TestingModule } from "@nestjs/testing"

describe("BuildRefreshTokenCookieService", () => {
  let module: TestingModule
  let prisma: PrismaService
  let buildRefreshTokenCookieService: BuildRefreshTokenCookieService
  let buildRefreshTokenService: BuildRefreshTokenService
  let refreshTokenStateFactory: RefreshTokenStateFactory

  beforeAll(async () => {
    module = await bootstrapTestModule()
    prisma = module.get<PrismaService>(PrismaService)

    refreshTokenStateFactory = await module.resolve(RefreshTokenStateFactory)
    buildRefreshTokenService = module.get<BuildRefreshTokenService>(
      BuildRefreshTokenService,
    )
    buildRefreshTokenCookieService = module.get<BuildRefreshTokenCookieService>(
      BuildRefreshTokenCookieService,
    )
  })

  it("should be defined", () => {
    expect(buildRefreshTokenCookieService).toBeDefined()
  })

  it("should successfully build a cookie with a refresh token", async () => {
    const refreshTokenState = await refreshTokenStateFactory.create()
    const refreshToken =
      await buildRefreshTokenService.execute(refreshTokenState)
    const result = buildRefreshTokenCookieService.execute(refreshToken)
    expect(result).toBeDefined()
  })

  afterEach(async () => await prisma.$truncateAll())
  afterAll(async () => await prisma.$disconnect())
})
