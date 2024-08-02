import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import { FindUserService } from "src/app/services/findUser.service"
import { User } from "src/app/types/user.type"

@Injectable()
export class CurrentUserGuard implements CanActivate {
  constructor(private findUserService: FindUserService) {}

  public async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ user: User}>()
    const { id } = request.user
    const currentUser = await this.getUser(id)
    if (!currentUser) return false

    return true
  }

  private async getUser(id: string) {
    return await this.findUserService.execute({
      id,
    })
  }
}
