import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma"
import { hash } from "bcrypt"
import { userWithPasswordSchema } from "src/app"
import { z } from "zod"
import createZodFactory from "src/zod/zod.factory"

@Injectable()
export class UserFactory extends createZodFactory(userWithPasswordSchema) {
  constructor(protected readonly prisma: PrismaService) {
    super()
  }

  public async save(data: z.output<typeof userWithPasswordSchema>) {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
        password: await hash(data.password, 10),
      },
    })

    return userWithPasswordSchema.parse(user)
  }
}
