import cookieParser from "cookie-parser"
import { Provider } from "@nestjs/common"
import { NestExpressApplication } from "@nestjs/platform-express"
import { bootstrapTestModule } from "./bootstrapTestModule"

export async function bootstrapTestApp(providers: Provider[] = []) {
  const testModule = await bootstrapTestModule(providers)
  const app = testModule.createNestApplication<NestExpressApplication>()
  app.use(cookieParser())
  return app
}
