import { Injectable } from "@nestjs/common"
import { ConfigService } from "src/config/services/config.service"

@Injectable()
export class BuildRefreshTokenCookieService {
  constructor(private readonly configService: ConfigService) {}

  public execute(refreshToken: string): string {
    const cookieSettings = this.buildCookieSettings()
    const name = this.configService.get("HTTP_COOKIE_REFRESH_TOKEN_NAME")
    return `${name}=${refreshToken}; ${cookieSettings}`
  }

  private buildCookieSettings() {
    const cookieExpireTime = this.configService.get("HTTP_COOKIE_EXPIRE_TIME")
    const cookieDomain = this.configService.get("HTTP_COOKIE_DOMAIN")
    const cookieSameSite = this.configService.get("HTTP_COOKIE_SAME_SITE")

    const cookieSettings = [
      `domain=${cookieDomain}`,
      `HttpOnly`,
      `Path=/`,
      `SameSite=${cookieSameSite}`,
      `Max-Age=${cookieExpireTime}`,
    ]

    return cookieSettings.join("; ")
  }
}
