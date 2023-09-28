import { CreateUserService } from "./createUser.service"
import { PrismaService } from "src/prisma"
import { TestingModule } from "@nestjs/testing"
import { bootstrapTestModule } from "src/utils/specs"
import { UserFactory } from "src/factories"
import { BadRequestException } from "@nestjs/common"

describe("CreateUserService", () => {
  let module: TestingModule
  let userFactory: UserFactory
  let createUserService: CreateUserService
  let prisma: PrismaService

  beforeAll(async () => {
    module = await bootstrapTestModule()
    userFactory = await module.resolve(UserFactory)
    createUserService = await module.resolve(CreateUserService)
    prisma = await module.resolve(PrismaService)
  })

  it("creates a user", async () => {
    const data = userFactory.build()
    const user = await createUserService.execute(data)
    expect(user).toBeDefined()
  })

  it("throws BadRequestException - user already exist", async () => {
    const { email } = await userFactory.create()
    const data = userFactory.build({ email })
    await expect(createUserService.execute(data)).rejects.toThrowError(
      BadRequestException,
    )
  })

  afterEach(async () => await prisma.$truncateAll())
  afterAll(async () => await prisma.$disconnect())
})
