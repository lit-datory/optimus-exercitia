import { PrismaModule } from "src/prisma/prisma.module"
import { AppModule } from "../app/app.module"
import { ConfigModule } from "../config/config.module"
import { CreateUserCommand } from "./commands"
import { Module } from "@nestjs/common"

@Module({
  imports: [PrismaModule, AppModule, ConfigModule],
  providers: [CreateUserCommand],
})
export class CommanderModule {}
