import { UserFactory } from "./user.factory"
import { Module } from "@nestjs/common"
import { PrismaModule } from "src/prisma/prisma.module"
import { RefreshTokenStateFactory } from "./refreshTokenState.factory"

const providers = [UserFactory, RefreshTokenStateFactory]

@Module({
  imports: [PrismaModule],
  providers,
  exports: providers,
})
export class FactoriesModule {}
