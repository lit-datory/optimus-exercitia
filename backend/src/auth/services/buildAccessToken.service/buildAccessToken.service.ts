import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { User } from "src/app"

type Data = { user: Pick<User, "id" | "email"> }

@Injectable()
export class BuildAccessTokenService {
  constructor(private jwtService: JwtService) {}

  public execute({ user }: Data) {
    return this.jwtService.sign({ email: user.email, sub: user.id })
  }
}
