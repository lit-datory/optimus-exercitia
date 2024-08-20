import { TestingModule } from "@nestjs/testing"
import { RefreshTokenStateFactory } from "src/factories"
import { PrismaService } from "src/prisma"
import { bootstrapTestModule } from "src/utils/specs"
import { DeleteRefreshTokenStateService } from "./deleteRefreshTokenState.service"

describe("DeleteRefreshTokenStateService", () => {
  let module: TestingModule
  let prisma: PrismaService
  let refreshTokenStateFactory: RefreshTokenStateFactory
  let deleteRefreshTokenStateService: DeleteRefreshTokenStateService

  beforeAll(async () => {
    module = await bootstrapTestModule()
    refreshTokenStateFactory = await module.resolve(RefreshTokenStateFactory)
    deleteRefreshTokenStateService = module.get<DeleteRefreshTokenStateService>(
      DeleteRefreshTokenStateService,
    )
    prisma = await module.resolve(PrismaService)
  })

  it("should be defined", () => {
    expect(deleteRefreshTokenStateService).toBeDefined()
  })

  it("should successfully deletes a refreshToken", async () => {
    const { id } = await refreshTokenStateFactory.create()
    await deleteRefreshTokenStateService.execute({ id })
    const refreshToken = await prisma.refreshTokenState.findFirst({
      where: { id },
    })
    expect(refreshToken).toBeNull()
  })

  afterEach(async () => {
    await prisma.$truncateAll()
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })
})
