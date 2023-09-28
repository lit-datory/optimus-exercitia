import { Provider } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "src/app/app.module"
import { AuthModule } from "src/auth/auth.module"
import { HealthModule } from "src/health/health.module"
import { ConfigModule } from "@nestjs/config"
import { FactoriesModule } from "src/factories/factories.module"

export async function bootstrapTestModule(
  providers: Provider[] = [],
): Promise<TestingModule> {
  return await Test.createTestingModule({
    imports: [
      AppModule,
      HealthModule,
      ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env.test"] }),
      AuthModule,
      FactoriesModule,
    ],
    providers: [...providers],
  }).compile()
}
