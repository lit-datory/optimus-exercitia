import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { Request } from "express"
import { VerifyCsrfTokenService } from "../../services/verifyCsrfToken.service"

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(
    private readonly verifyCsrfTokenService: VerifyCsrfTokenService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest()
    const csrfTokenCookie = this.getCsrfTokenFromCookie(request)
    const csrfToken = this.getCsrfTokenFromHeaders(request)
    if (!csrfTokenCookie || !csrfToken) throw new UnauthorizedException()
    const isVerified =
      this.verifyToken(csrfToken) && this.verifyToken(csrfTokenCookie)
    const isEqual = csrfToken === csrfTokenCookie
    if (!isVerified || !isEqual) throw new UnauthorizedException()
    return isVerified && isEqual
  }

  private getCsrfTokenFromCookie(request: Request): string | undefined {
    const cookies: { _csrf?: string } = request.cookies as {
      _csrf?: string
    }
    if (cookies) return cookies["_csrf"]
  }

  private getCsrfTokenFromHeaders(request: Request): string | undefined {
    const headers: { ["x-csrf-token"]?: string } = request.headers as {
      ["x-csrf-token"]?: string
    }
    if (headers) return headers["x-csrf-token"]
  }

  private verifyToken(token: string): boolean {
    return this.verifyCsrfTokenService.execute(token)
  }
}
