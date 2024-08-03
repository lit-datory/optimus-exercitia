import { Injectable, UnauthorizedException } from "@nestjs/common"
import { createHmac } from "crypto"
import { ConfigService } from "src/config/services/config.service"

type ParsedCsrfToken = {
  sessionId: string
  expiresAt: number
  hash: string
}

@Injectable()
export class VerifyCsrfTokenService {
  constructor(private readonly configService: ConfigService) {}

  public execute(token: string): boolean {
    this.validateToken(token)
    const parsedToken = this.parseToken(token)
    const { expiresAt } = parsedToken
    this.verifyExpiresAt(expiresAt)
    return this.verifyHash(parsedToken)
  }

  private createHmacHash(sessionId: string, expiresAt: number): string {
    const secret = this.configService.get("CSRF_TOKEN_SECRET_KEY")
    const key = `${sessionId}.${expiresAt.toString()}`
    const hmac = createHmac("sha256", secret)
    hmac.update(key)
    return hmac.digest("base64")
  }

  private validateToken(token: string): void {
    if (token.split(".").length !== 3) {
      throw new UnauthorizedException()
    }
  }

  private parseToken(token: string): ParsedCsrfToken {
    const split = token.split(".")
    return {
      sessionId: split[0],
      expiresAt: Number(split[1]),
      hash: split[2],
    }
  }

  private verifyExpiresAt(expiresAt: number): void {
    const currentUnixTimestamp = Math.floor(Date.now() / 1000)
    if (expiresAt < currentUnixTimestamp) {
      throw new UnauthorizedException()
    }
  }

  private verifyHash(parsedToken: ParsedCsrfToken): boolean {
    const recreatedHash = this.createHmacHash(
      parsedToken.sessionId,
      parsedToken.expiresAt,
    )
    return recreatedHash === parsedToken.hash
  }
}
