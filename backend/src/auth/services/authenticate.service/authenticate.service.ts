import { Injectable, UnauthorizedException } from "@nestjs/common"
import { compare } from "bcrypt"
import { User } from "@prisma/client"
import { PrismaService } from "src/prisma"

type Data = { email: User["email"]; password: User["password"] }

@Injectable()
export class AuthenticateService {
  constructor(private prisma: PrismaService) {}

  public async execute({ email, password }: Data) {
    const user = await this.getUserByEmail(email)
    if (!user) throw new UnauthorizedException()

    const isValid = await compare(password, user.password)
    if (!isValid) throw new UnauthorizedException()

    return user
  }

  private async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { email, blocked: false },
    })
  }
}
