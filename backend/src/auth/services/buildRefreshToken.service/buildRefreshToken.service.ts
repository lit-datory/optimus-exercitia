import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { RefreshTokenState } from "@prisma/client"
import { ConfigService } from "src/config/services/config.service"

@Injectable()
export class BuildRefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async execute(refreshToken: RefreshTokenState): Promise<string> {
    const refreshTokenExpireTime = this.configService.get(
      "JWT_REFRESH_TOKEN_EXPIRE_TIME",
    )
    const payload = this.buildJwtPayload(refreshToken)
    return await this.jwtService.signAsync(payload, {
      expiresIn: `${refreshTokenExpireTime}s`,
    })
  }

  private buildJwtPayload(refreshToken: RefreshTokenState): { sub: string } {
    return { sub: refreshToken.id }
  }
}
