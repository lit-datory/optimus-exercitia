import { Injectable } from "@nestjs/common"
import { ConfigService } from "src/config/services/config.service"

@Injectable()
export class BuildRefreshTokenCookieService {
  constructor(private readonly configService: ConfigService) {}

  public execute(refreshToken: string): string {
    const cookieExpireTime = this.configService.get("HTTP_COOKIE_EXPIRE_TIME")
    const cookieDomain = this.configService.get("HTTP_COOKIE_DOMAIN")
    const cookieSameSite = this.configService.get("HTTP_COOKIE_SAME_SITE")

    return `refreshToken=${refreshToken}; HttpOnly; Secure; domain=${cookieDomain}; Path=/; SameSite=${cookieSameSite}; Max-Age=${cookieExpireTime}`
  }
}
