import { FindUserService } from "./findUser.service"
import { PrismaService } from "src/prisma"
import { TestingModule } from "@nestjs/testing"
import { bootstrapTestModule } from "src/utils/specs"
import { UserFactory } from "src/factories"

describe("FindUserService", () => {
  let module: TestingModule
  let userFactory: UserFactory
  let findUserService: FindUserService
  let prisma: PrismaService

  beforeAll(async () => {
    module = await bootstrapTestModule()
    userFactory = await module.resolve(UserFactory)
    findUserService = await module.resolve(FindUserService)
    prisma = await module.resolve(PrismaService)
  })

  it("returns user by email", async () => {
    const { email } = await userFactory.create()
    const result = await findUserService.execute({ email })
    expect(result).toBeDefined()
  })

  it("returns user by id", async () => {
    const { id } = await userFactory.create()

    const result = await findUserService.execute({ id })
    expect(result).toBeDefined()
  })

  it("returns user that is blocked", async () => {
    const { blocked } = await userFactory.create({ blocked: true })
    const user = await findUserService.execute({ blocked })
    expect(user).toBeDefined()
  })

  it("returns undefined when user is not found", async () => {
    const user = await findUserService.execute({ email: "test@test.com" })
    expect(user).toBeUndefined()
  })

  afterEach(async () => { await prisma.$truncateAll(); })
  afterAll(async () => { await prisma.$disconnect(); })
})
