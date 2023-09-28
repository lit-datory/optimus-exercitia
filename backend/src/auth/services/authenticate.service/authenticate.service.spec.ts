import { AuthenticateService } from "./authenticate.service"
import { TestingModule } from "@nestjs/testing"
import { UnauthorizedException } from "@nestjs/common"
import { bootstrapTestModule } from "src/utils/specs"
import { PrismaService } from "src/prisma"
import { UserFactory } from "src/factories"

describe("AuthenticateService", () => {
  let module: TestingModule
  let userFactory: UserFactory
  let authenticateService: AuthenticateService
  let prisma: PrismaService

  beforeAll(async () => {
    module = await bootstrapTestModule()
    userFactory = await module.resolve(UserFactory)
    authenticateService = await module.resolve(AuthenticateService)
    prisma = await module.resolve(PrismaService)
  })

  it("returns the user when valid", async () => {
    const password = "randomPassword"
    const { email } = await userFactory.create({ password })
    const result = await authenticateService.execute({ email, password })

    expect(result).toBeDefined()
  })

  it("throws unauthorized exception when password doesn't match", async () => {
    const password = "randomPassword"
    const { email } = await userFactory.create({ password })

    await expect(
      authenticateService.execute({
        email,
        password: "other",
      }),
    ).rejects.toThrowError(UnauthorizedException)
  })

  it("throws unauthorized exception when user is not found", async () => {
    const password = "randomPassword"
    await userFactory.create({ password })

    await expect(
      authenticateService.execute({
        email: "random@email.com",
        password,
      }),
    ).rejects.toThrowError(UnauthorizedException)
  })

  it("throws unauthorized exception when user is blocked", async () => {
    const password = "randomPassword"
    const { email } = await userFactory.create({ password, blocked: true })

    await expect(
      authenticateService.execute({
        email,
        password,
      }),
    ).rejects.toThrowError(UnauthorizedException)
  })

  afterEach(async () => await prisma.$truncateAll())
  afterAll(async () => await prisma.$disconnect())
})
