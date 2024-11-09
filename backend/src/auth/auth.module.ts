import { ConfigModule } from "../config/config.module"
import { JwtModule } from "@nestjs/jwt"
import { JwtStrategy } from "./strategies"
import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { AuthController } from "./controllers/auth.controller"
import { DeleteRefreshTokenStateService } from "./services/deleteRefreshTokenState.service"
import { ConfigService } from "../config/services/config.service"
import { RefreshTokenService } from "./services/refreshToken.service/refreshToken.service"
import { AuthenticateService } from "./services/authenticate.service"
import { BuildRefreshTokenCookieService } from "./services/buildRefreshTokenCookie.service"
import { BuildRefreshTokenService } from "./services/buildRefreshToken.service"
import { CreateRefreshTokenStateService } from "./services/createRefreshTokenState.service"
import { BuildAccessTokenService } from "./services/buildAccessToken.service"

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET_KEY"),
        signOptions: {
          expiresIn: `${configService.get("JWT_ACCESS_TOKEN_EXPIRE_TIME")}s`,
        },
      }),
    }),
  ],
  providers: [
    AuthenticateService,
    BuildRefreshTokenCookieService,
    BuildRefreshTokenService,
    CreateRefreshTokenStateService,
    BuildAccessTokenService,
    JwtStrategy,
    DeleteRefreshTokenStateService,
    RefreshTokenService,
  ],
  controllers: [AuthController],
  exports: [BuildAccessTokenService],
})
export class AuthModule {}
