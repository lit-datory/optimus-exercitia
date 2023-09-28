import { BadRequestException, Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { PrismaService } from "src/prisma"
import { hash } from "bcrypt"
import { userSchema } from "src/app/schemas"

type Data = Omit<Prisma.UserUncheckedCreateInput, "blocked">

@Injectable()
export class CreateUserService {
  constructor(private prisma: PrismaService) {}

  public async execute(
    { email, firstName, lastName, password }: Data,
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    await this.userExists(email, prisma)
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: await hash(password, 10),
        firstName: firstName,
        lastName: lastName,
        blocked: false,
      },
    })

    return userSchema.parse(newUser)
  }

  private async userExists(email: string, prisma: Prisma.TransactionClient) {
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    })

    if (user) {
      throw new BadRequestException()
    }
  }
}
