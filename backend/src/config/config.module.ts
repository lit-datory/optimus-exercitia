import { Module } from "@nestjs/common"
import { ConfigModule as BaseConfigModule } from "@nestjs/config"
import { configSchema } from "./schemas"
import { ConfigService } from "./services/config.service"

@Module({
  imports: [
    BaseConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV ?? ""}`],
      validate: (config: Record<string, unknown>) => {
        return configSchema.parse(config)
      },
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
