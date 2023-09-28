import {
  Controller,
  Post,
  UseGuards,
  Req,
  Headers,
  Res,
  HttpCode,
  Body,
  UnauthorizedException,
} from "@nestjs/common"
import { CsrfGuard } from "src/auth/guards"
import { Response } from "express"
import { badRequestSchema, unauthorizedSchema, UseSchema } from "src/zod"
import {
  loginBodySchema,
  authResponseSchema,
  logoutResponseSchema,
} from "./schemas"
import { BuildRefreshTokenService } from "src/auth/services/buildRefreshToken.service"
import { CreateRefreshTokenStateService } from "src/auth/services/createRefreshTokenState.service"
import { BuildRefreshTokenCookieService } from "src/auth/services/buildRefreshTokenCookie.service"
import { BuildCsrfTokenService } from "src/auth/services/buildCsrfToken.service"
import { BuildCsrfCookieService } from "src/auth/services/buildCsrfCookie.service"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { JwtService } from "@nestjs/jwt"
import { RefreshTokenService } from "src/auth/services/refreshToken.service/refreshToken.service"
import { BuildAccessTokenService } from "src/auth/services/buildAccessToken.service"
import { DeleteRefreshTokenStateService } from "src/auth/services/deleteRefreshTokenState.service"
import { AuthenticateService } from "src/auth/services/authenticate.service"
import { ConfigService } from "src/config/services/config.service"
import { LoginBody } from "./types"
import { PrismaService } from "src/prisma"
import { Prisma } from "@prisma/client"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private buildAccessTokenService: BuildAccessTokenService,
    private buildRefreshTokenService: BuildRefreshTokenService,
    private createRefreshTokenStateService: CreateRefreshTokenStateService,
    private buildRefreshTokenCookieService: BuildRefreshTokenCookieService,
    private buildCsrfTokenService: BuildCsrfTokenService,
    private buildCsrfCookieService: BuildCsrfCookieService,
    private deleteRefreshTokenStateService: DeleteRefreshTokenStateService,
    private authenticateService: AuthenticateService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  @ApiOperation({
    description: "Logs the user in by email and password",
  })
  @Post("login")
  @HttpCode(200)
  @UseSchema({
    body: loginBodySchema,
    response: {
      200: authResponseSchema,
      401: unauthorizedSchema,
      400: badRequestSchema,
    },
  })
  public async login(
    @Body() data: LoginBody,
    @Res({ passthrough: true }) res: Response,
    @Headers("user-agent") userAgent?: string,
  ) {
    const user = await this.authenticateService.execute(data)
    const accessToken = this.buildAccessTokenService.execute({ user })
    const refreshTokenState = await this.createRefreshTokenStateService.execute(
      {
        userId: user.id,
        userAgent: userAgent ?? "unknown",
      },
    )
    const refreshToken =
      await this.buildRefreshTokenService.execute(refreshTokenState)
    const refreshTokenCookie = this.buildRefreshTokenCookie(refreshToken)
    const csrfCookie = this.buildCsrfCookie()
    res.setHeader("Set-Cookie", [refreshTokenCookie, csrfCookie])

    return { accessToken }
  }

  @ApiOperation({
    description: "Logs the user out",
  })
  @Post("logout")
  @HttpCode(200)
  @UseSchema({
    response: { 200: logoutResponseSchema },
  })
  public async logout(
    @Req()
    { cookies }: { cookies?: Record<string, string> },
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    try {
      const refreshToken = this.getRefreshTokenFrom(cookies)
      if (refreshToken) {
        const id = await this.verifyRefreshToken(refreshToken)
        await this.deleteRefreshTokenStateService.execute({
          id,
        })
      }
    } catch (_) {
    } finally {
      const domain = this.configService.get("HTTP_COOKIE_DOMAIN")
      res.clearCookie("refreshToken", { domain })
      res.clearCookie("_csrf", { domain })
      return "successfully logged out!"
    }
  }

  @ApiOperation({
    description: "Refreshes access token",
  })
  @Post("refresh_token")
  @UseGuards(CsrfGuard)
  @HttpCode(200)
  @UseSchema({
    response: { 401: unauthorizedSchema, 200: authResponseSchema },
  })
  public async refreshToken(
    @Req()
    { cookies }: { cookies?: { refreshToken?: string } },
    @Res({ passthrough: true }) res: Response,
    @Headers("user-agent") userAgent?: string,
  ) {
    return await this.prisma.$transaction(
      async (transaction: Prisma.TransactionClient) => {
        const existingRefreshToken = this.getRefreshTokenFrom(cookies)
        if (!existingRefreshToken) throw new UnauthorizedException()
        const id = await this.verifyRefreshToken(existingRefreshToken)
        const { accessToken, refreshToken } =
          await this.refreshTokenService.execute(
            {
              id,
              userAgent: userAgent ?? "unknown",
            },
            transaction,
          )

        const refreshTokenCookie = this.buildRefreshTokenCookie(refreshToken)
        const csrfCookie = this.buildCsrfCookie()

        res.setHeader("Set-Cookie", [refreshTokenCookie, csrfCookie])
        return { accessToken }
      },
    )
  }

  private buildRefreshTokenCookie(refreshToken: string): string {
    return this.buildRefreshTokenCookieService.execute(refreshToken)
  }

  private buildCsrfCookie(): string {
    const csrfCookie = this.buildCsrfTokenService.execute()
    return this.buildCsrfCookieService.execute(csrfCookie)
  }

  private getRefreshTokenFrom(
    cookies?: Record<string, string>,
  ): string | undefined {
    if (!cookies) return undefined
    return cookies["refreshToken"]
  }

  private async verifyRefreshToken(refreshToken: string): Promise<string> {
    try {
      const { sub } = await this.jwtService.verifyAsync(refreshToken)
      return sub
    } catch (_) {
      throw new UnauthorizedException()
    }
  }
}
