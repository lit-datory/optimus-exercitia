import { BaseFactory } from "./base.factory"
import { Injectable } from "@nestjs/common"
import { Prisma, User } from "@prisma/client"
import { PrismaService } from "src/prisma"
import { faker } from "@faker-js/faker"
import { hash } from "bcrypt"

type BuildAttr = Prisma.UserUncheckedCreateInput
type CreateAttr = User

@Injectable()
export class UserFactory extends BaseFactory<BuildAttr, CreateAttr> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma)
  }

  protected async save(data: BuildAttr): Promise<CreateAttr> {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
        password: await hash(data.password, 10),
      },
    })

    return user
  }

  protected generate(): BuildAttr {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 5 }),
      firstName: faker.internet.userName(),
      lastName: faker.internet.userName(),
      blocked: false,
    }
  }
}
