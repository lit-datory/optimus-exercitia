import { UnauthorizedException } from "@nestjs/common"
import { TestingModule } from "@nestjs/testing"
import { randomUUID } from "crypto"
import { RefreshTokenStateFactory, UserFactory } from "src/factories"
import { PrismaService } from "src/prisma"
import { bootstrapTestModule } from "src/utils/specs"
import { RefreshTokenService } from "./refreshToken.service"

describe("RefreshTokenService", () => {
  let module: TestingModule
  let prisma: PrismaService
  let userFactory: UserFactory
  let refreshTokenStateFactory: RefreshTokenStateFactory
  let refreshTokenService: RefreshTokenService

  beforeAll(async () => {
    module = await bootstrapTestModule()
    userFactory = await module.resolve(UserFactory)
    refreshTokenStateFactory = await module.resolve(RefreshTokenStateFactory)
    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService)
    prisma = await module.resolve(PrismaService)
  })

  it("should successfully refresh an access & refresh token", async () => {
    const { id, userAgent } = await refreshTokenStateFactory.create()
    const { accessToken, refreshToken } = await refreshTokenService.execute({
      id,
      userAgent,
    })
    expect(accessToken).toBeDefined()
    expect(refreshToken).toBeDefined()
  })

  it("throws UnauthorizedException - user is blocked", async () => {
    const { id: userId } = await userFactory.create({ blocked: true })
    const { id, userAgent } = await refreshTokenStateFactory.create({
      userId,
    })
    await expect(
      refreshTokenService.execute({
        id,
        userAgent,
      }),
    ).rejects.toThrow(UnauthorizedException)
  })

  it("throws UnauthorizedException - refresh token state is not found", async () => {
    await expect(
      refreshTokenService.execute({
        id: randomUUID(),
        userAgent: "unknown",
      }),
    ).rejects.toThrow(UnauthorizedException)
  })
  afterEach(async () => await prisma.$truncateAll())
  afterAll(async () => await prisma.$disconnect())
})
