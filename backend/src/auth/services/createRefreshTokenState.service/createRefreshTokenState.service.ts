import { Injectable } from "@nestjs/common"
import { Prisma, RefreshTokenState } from "@prisma/client"
import { PrismaService } from "src/prisma"

type Data = {
  userAgent: RefreshTokenState["userAgent"]
  userId: RefreshTokenState["userId"]
}

@Injectable()
export class CreateRefreshTokenStateService {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(
    data: Data,
    prisma: Prisma.TransactionClient = this.prisma,
  ): Promise<RefreshTokenState> {
    return await prisma.refreshTokenState.create({
      data,
    })
  }
}
