import { TestingModule } from "@nestjs/testing"
import { bootstrapTestModule } from "src/utils/specs"
import { PrismaService } from "src/prisma/prisma.service"
import { BuildRefreshTokenService } from "./buildRefreshToken.service"
import { RefreshTokenStateFactory } from "src/factories"

describe("BuildRefreshTokenService", () => {
  let module: TestingModule
  let prisma: PrismaService
  let refreshTokenStateFactory: RefreshTokenStateFactory
  let buildRefreshTokenService: BuildRefreshTokenService

  beforeAll(async () => {
    module = await bootstrapTestModule()
    prisma = module.get<PrismaService>(PrismaService)
    refreshTokenStateFactory = await module.resolve(RefreshTokenStateFactory)
    buildRefreshTokenService = module.get<BuildRefreshTokenService>(
      BuildRefreshTokenService,
    )
  })

  it("should be defined", () => {
    expect(buildRefreshTokenService).toBeDefined()
  })

  it("should successfully build a refresh token", async () => {
    const refreshTokenState = await refreshTokenStateFactory.create()
    const result = await buildRefreshTokenService.execute(refreshTokenState)
    expect(result).toBeDefined()
  })

  afterEach(async () => {
    await prisma.$truncateAll()
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })
})
