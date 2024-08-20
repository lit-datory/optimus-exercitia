import { ExecutionContext } from "@nestjs/common"
import { TestingModule } from "@nestjs/testing"
import { UserFactory } from "src/factories"
import { PrismaService } from "src/prisma"
import { bootstrapTestModule } from "src/utils/specs"
import { FindUserService } from "src/app/services/findUser.service"
import { CurrentUserGuard } from "./currentUser.guard"

describe("CurrentUserGuard", () => {
  let module: TestingModule
  let currentUserGuard: CurrentUserGuard
  let userFactory: UserFactory
  let prisma: PrismaService

  beforeAll(async () => {
    module = await bootstrapTestModule()
    currentUserGuard = new CurrentUserGuard(
      await module.resolve(FindUserService),
    )
    userFactory = await module.resolve(UserFactory)
    prisma = await module.resolve(PrismaService)
  })

  it("returns true - when user is found", async () => {
    const user = await userFactory.create()
    const mockExecutionContext = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user }),
      }),
    } as unknown as ExecutionContext

    expect(
      await currentUserGuard.canActivate(mockExecutionContext),
    ).toBeTruthy()
  })

  it("returns false - when user does not exist", async () => {
    const mockExecutionContext = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { id: "7f3f076b-3ea1-4114-97be-58edcf6707cf" },
        }),
      }),
    } as unknown as ExecutionContext
    expect(await currentUserGuard.canActivate(mockExecutionContext)).toBeFalsy()
  })

  afterEach(async () => {
    await prisma.$truncateAll()
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })
})
