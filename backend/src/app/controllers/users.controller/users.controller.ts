import { Body, Controller, Post } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { badRequestSchema, UseSchema } from "src/zod"
import { CreateUserService } from "src/app/services/createUser.service"
import { createUserBodySchema, createUserResponseSchema } from "./schemas"
import { CreateUserBody } from "./types"

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly createUserService: CreateUserService) {}

  @ApiOperation({ description: "creates a new user" })
  @UseSchema({
    body: createUserBodySchema,
    response: { 200: createUserResponseSchema, 400: badRequestSchema },
  })
  @Post()
  public async create(@Body() userData: CreateUserBody) {
    return await this.createUserService.execute(userData)
  }
}
