import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { notFoundSchema, unauthorizedSchema, UseSchema } from "src/zod"
import { JwtAuthGuard } from "src/auth"
import { CurrentAccessToken } from "src/auth/types"
import { FindUserService } from "src/app/services/findUser.service"
import { getProfileResponseSchema } from "./schemas"

@ApiTags("Users")
@Controller("profile")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly findUserService: FindUserService) {}

  @ApiOperation({ description: "gets current user" })
  @UseSchema({
    response: {
      200: getProfileResponseSchema,
      401: unauthorizedSchema,
      404: notFoundSchema,
    },
  })
  @Get()
  public async get(@Req() { user: currentUser }: { user: CurrentAccessToken }) {
    if (currentUser) {
      const user = await this.findUserService.execute({ id: currentUser.id })
      if (user) {
        return user
      }
    }
    throw new NotFoundException()
  }
}
