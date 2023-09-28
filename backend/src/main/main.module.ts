import { AuthModule } from "src/auth/auth.module"
import { Module } from "@nestjs/common"
import { AppModule } from "src/app/app.module"
import { PrismaModule } from "src/prisma/prisma.module"

@Module({
  imports: [PrismaModule, AuthModule, AppModule],
})
export class MainModule {}
