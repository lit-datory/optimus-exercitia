import { Injectable } from "@nestjs/common"
import { ConfigService } from "src/config/services/config.service"

@Injectable()
export class BuildCsrfCookieService {
  constructor(private readonly configService: ConfigService) {}

  public execute(csrfToken: string): string {
    const cookieExpireTime = this.getCookieExpireTime()
    const cookieDomain = this.configService.get("HTTP_COOKIE_DOMAIN")
    return `_csrf=${csrfToken}; Secure; domain=${cookieDomain}; Path=/; SameSite=Strict; Max-Age=${cookieExpireTime}`
  }

  private getCookieExpireTime(): number {
    return this.configService.get("HTTP_COOKIE_EXPIRE_TIME")
  }
}
