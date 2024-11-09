import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { PrismaService } from "src/prisma"

@Injectable()
export class DeleteRefreshTokenStateService {
  constructor(private prisma: PrismaService) {}

  public async execute(
    params: Prisma.RefreshTokenStateWhereUniqueInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ): Promise<void> {
    const { id } = params
    if (id) {
      await prisma.refreshTokenState.deleteMany({ where: { id } })
    }
    return
  }
}
