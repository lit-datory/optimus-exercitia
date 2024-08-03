import request from "supertest"
import { NestExpressApplication } from "@nestjs/platform-express"
import { PrismaService } from "src/prisma"
import { bootstrapTestApp } from "src/utils/specs"
import { UserFactory } from "src/factories"

describe("POST /users", () => {
  let app: NestExpressApplication
  let prisma: PrismaService
  let userFactory: UserFactory

  beforeEach(async () => {
    app = await bootstrapTestApp()
    userFactory = await app.resolve(UserFactory)
    prisma = await app.resolve(PrismaService)
    await app.init()
  })

  it("returns 201", async () => {
    const { email, firstName, lastName, password } = userFactory.build()

    const response = await request(app.getHttpServer())
      .post("/users")
      .send({
        firstName,
        lastName,
        email,
        password,
        passwordConfirmation: password,
      })
      .expect(201)
    expect(response.body).toBeDefined()
  })

  it("returns 400 - invalid data (firsName missing)", async () => {
    const { email, lastName, password } = userFactory.build()

    const response = await request(app.getHttpServer())
      .post("/users")
      .send({
        lastName,
        email,
        password,
        passwordConfirmation: password,
      })
      .expect(400)
    expect(response.body).toBeDefined()
  })

  afterEach(async () => { await prisma.$truncateAll(); })
  afterAll(async () => { await app.close(); })
})
