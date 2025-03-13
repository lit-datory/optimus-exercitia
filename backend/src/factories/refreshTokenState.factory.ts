import { Injectable } from "@nestjs/common"
import { User } from "@prisma/client"
import { PrismaService } from "src/prisma"
import { UserFactory } from "./user.factory"
import { refreshTokenSchema } from "src/app/schemas/refreshTokenSchema"
import { z } from "zod"
import createZodFactory from "src/zod/zod.factory"

@Injectable()
export class RefreshTokenStateFactory extends createZodFactory(
  refreshTokenSchema,
) {
  constructor(
    protected readonly prisma: PrismaService,
    private userFactory: UserFactory,
  ) {
    super()
  }

  public async save(data: z.output<typeof refreshTokenSchema>) {
    await this.handleUser(data.userId)
    const refreshTokenState = await this.prisma.refreshTokenState.create({
      data: {
        ...data,
      },
    })

    return refreshTokenState
  }

  private async handleUser(id: User["id"]) {
    const user = await this.prisma.user.findFirst({ where: { id } })
    if (!user) await this.userFactory.create({ id })
  }
}
