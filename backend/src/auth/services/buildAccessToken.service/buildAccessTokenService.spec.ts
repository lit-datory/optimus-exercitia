import { PrismaService } from "src/prisma"
import { TestingModule } from "@nestjs/testing"
import { bootstrapTestModule } from "src/utils/specs"
import { BuildAccessTokenService } from "./buildAccessToken.service"
import { UserFactory } from "src/factories"

describe("BuildAccessTokenService", () => {
  let module: TestingModule
  let userFactory: UserFactory
  let buildAccessTokenService: BuildAccessTokenService
  let prisma: PrismaService

  beforeAll(async () => {
    module = await bootstrapTestModule()
    userFactory = await module.resolve(UserFactory)
    buildAccessTokenService = await module.resolve(BuildAccessTokenService)
    prisma = await module.resolve(PrismaService)
  })

  it("returns a signed token", async () => {
    const user = await userFactory.create()
    const accessToken = buildAccessTokenService.execute({ user })
    expect(accessToken).toBeDefined()
  })

  afterEach(async () => {
    await prisma.$truncateAll()
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })
})
