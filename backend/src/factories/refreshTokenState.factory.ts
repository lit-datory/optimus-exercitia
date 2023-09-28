import { BaseFactory } from "./base.factory"
import { Injectable } from "@nestjs/common"
import { Prisma, RefreshTokenState, User } from "@prisma/client"
import { PrismaService } from "src/prisma"
import { faker } from "@faker-js/faker"
import { UserFactory } from "./user.factory"

type BuildAttr = Prisma.RefreshTokenStateUncheckedCreateInput
type CreateAttr = RefreshTokenState

@Injectable()
export class RefreshTokenStateFactory extends BaseFactory<
  BuildAttr,
  CreateAttr
> {
  constructor(
    protected readonly prisma: PrismaService,
    private userFactory: UserFactory,
  ) {
    super(prisma)
  }

  protected async save(data: BuildAttr): Promise<CreateAttr> {
    await this.handleUser(data.userId)
    const refreshTokenState = await this.prisma.refreshTokenState.create({
      data: {
        ...data,
      },
    })

    return refreshTokenState
  }

  protected generate(): BuildAttr {
    return {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      userAgent: faker.internet.userAgent(),
    }
  }

  private async handleUser(id: User["id"]) {
    const user = await this.prisma.user.findFirst({ where: { id } })
    if (!user) await this.userFactory.create({ id })
  }
}
