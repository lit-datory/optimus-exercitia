import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { User } from "src/app"

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): User => {
    const request: { user: User } = ctx.switchToHttp().getRequest()
    return request.user
  },
)
