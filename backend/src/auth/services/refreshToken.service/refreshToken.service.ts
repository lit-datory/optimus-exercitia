import { Injectable, UnauthorizedException } from "@nestjs/common"
import { BuildAccessTokenService } from "src/auth/services/buildAccessToken.service"
import { BuildRefreshTokenService } from "src/auth/services/buildRefreshToken.service"
import { PrismaService } from "src/prisma"
import { Prisma, RefreshTokenState } from "@prisma/client"

type Data = {
  id: RefreshTokenState["id"]
  userAgent: RefreshTokenState["userAgent"]
}

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buildAccessTokenService: BuildAccessTokenService,
    private readonly buildRefreshTokenService: BuildRefreshTokenService,
  ) {}

  public async execute(
    data: Data,
    prisma: Prisma.TransactionClient = this.prisma,
  ): Promise<{ refreshToken: string; accessToken: string }> {
    const { id, userAgent } = data
    await this.validateRefreshTokenState({ id }, prisma)
    const refreshTokenState = await this.updateRefreshTokenState(
      {
        id,
        userAgent,
      },
      prisma,
    )
    const { user } = refreshTokenState
    const accessToken = this.buildAccessTokenService.execute({ user })
    const refreshToken =
      await this.buildRefreshTokenService.execute(refreshTokenState)
    return {
      refreshToken,
      accessToken,
    }
  }

  private async validateRefreshTokenState(
    { id }: { id: string },
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    const refreshTokenState = await prisma.refreshTokenState.findFirst({
      where: {
        id,
        user: {
          blocked: false,
        },
      },
    })
    if (!refreshTokenState) throw new UnauthorizedException()
  }

  private async updateRefreshTokenState(
    { id, userAgent }: Data,
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.refreshTokenState.update({
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      where: { id },
      data: { userAgent, updatedAt: new Date() },
    })
  }
}
