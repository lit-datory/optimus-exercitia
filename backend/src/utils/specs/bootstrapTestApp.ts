import * as cookieParser from "cookie-parser"
import { INestApplication, Provider } from "@nestjs/common"
import { bootstrapTestModule } from "./bootstrapTestModule"

export async function bootstrapTestApp(
  providers: Provider[] = [],
): Promise<INestApplication> {
  const testModule = await bootstrapTestModule(providers)
  const app = testModule.createNestApplication()
  app.use(cookieParser())
  return app
}
