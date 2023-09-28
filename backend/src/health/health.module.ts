import { ConfigModule } from "src/config/config.module"
import { HttpModule } from "@nestjs/axios"
import { Module } from "@nestjs/common"
import { PrismaHealthIndicator } from "./indicators"
import { PrismaModule } from "src/prisma/prisma.module"
import { TerminusModule } from "@nestjs/terminus"
import { HealthController } from "./controllers/health.controller"

@Module({
  imports: [TerminusModule, HttpModule, PrismaModule, ConfigModule],
  providers: [PrismaHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
