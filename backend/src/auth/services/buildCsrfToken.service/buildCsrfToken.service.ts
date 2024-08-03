import { Injectable } from "@nestjs/common"
import { createHmac, randomBytes } from "crypto"
import { ConfigService } from "src/config/services/config.service"

@Injectable()
export class BuildCsrfTokenService {
  constructor(private readonly configService: ConfigService) {}

  public execute(): string {
    const sessionId = randomBytes(64).toString("hex")
    const cookieExpireTime = this.getCookieExpireTime()
    const expiresAt = (Math.floor(Date.now() / 1000) + Number(cookieExpireTime)).toString()
    const hash = this.createHmacHash(sessionId, expiresAt)
    return `${sessionId}.${expiresAt}.${hash}`
  }

  private createHmacHash(sessionId: string, expiresAt:string): string {
    const secret = this.configService.get("CSRF_TOKEN_SECRET_KEY")
    const key = `${sessionId}.${expiresAt}`
    const hmac = createHmac("sha256", secret)
    hmac.update(key)
    return hmac.digest("base64")
  }

  private getCookieExpireTime() {
    const cookieExpireTime = this.configService.get(
      "HTTP_COOKIE_EXPIRE_TIME",
    )
    return cookieExpireTime
  }
}
