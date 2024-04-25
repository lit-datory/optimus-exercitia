import { AuthModule } from "src/auth/auth.module"
import { Module } from "@nestjs/common"
import { AppModule } from "src/app/app.module"
import { PrismaModule } from "src/prisma/prisma.module"
import { HealthModule } from "src/health/health.module"

@Module({
  imports: [PrismaModule, AuthModule, AppModule, HealthModule],
})
export class MainModule {}
