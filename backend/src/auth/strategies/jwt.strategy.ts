import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { CurrentAccessToken, AccessTokenPayload } from "../types"
import { accessTokenSchema } from "../schemas"
import { ConfigService } from "src/config/services/config.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET_KEY"),
    })
  }

  public async validate(
    payload: AccessTokenPayload,
  ): Promise<CurrentAccessToken> {
    return await accessTokenSchema.parseAsync(payload)
  }
}
