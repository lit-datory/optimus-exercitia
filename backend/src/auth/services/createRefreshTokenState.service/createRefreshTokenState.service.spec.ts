import { CreateRefreshTokenStateService } from "./createRefreshTokenState.service"
import { PrismaService } from "src/prisma"
import { bootstrapTestModule } from "src/utils/specs"
import { UserFactory } from "src/factories"
import { TestingModule } from "@nestjs/testing"

describe("FindOrCreateRefreshTokenService", () => {
  let module: TestingModule
  let prisma: PrismaService
  let createRefreshTokenService: CreateRefreshTokenStateService
  let userFactory: UserFactory

  beforeAll(async () => {
    module = await bootstrapTestModule()
    prisma = module.get<PrismaService>(PrismaService)
    userFactory = await module.resolve(UserFactory)
    createRefreshTokenService = module.get<CreateRefreshTokenStateService>(
      CreateRefreshTokenStateService,
    )
  })

  it("should be defined", () => {
    expect(createRefreshTokenService).toBeDefined()
  })

  it("should successfully create a new refresh token", async () => {
    const user = await userFactory.create()
    const data = { userId: user.id, userAgent: "test" }
    const result = await createRefreshTokenService.execute(data)
    expect(result).toBeDefined()
  })

  afterEach(async () => await prisma.$truncateAll())
  afterAll(async () => await prisma.$disconnect())
})
