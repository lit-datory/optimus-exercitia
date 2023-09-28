import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { userSchema } from "src/app/schemas"
import { User } from "src/app/types"
import { PrismaService } from "src/prisma"

export type QueryData = Prisma.UserWhereInput

@Injectable()
export class FindUserService {
  constructor(private prisma: PrismaService) {}

  public async execute(
    data: QueryData,
    prisma: Prisma.TransactionClient = this.prisma,
  ): Promise<User | undefined> {
    const user = await prisma.user.findFirst({ where: data })

    if (user) {
      return userSchema.parse(user)
    }
  }
}
