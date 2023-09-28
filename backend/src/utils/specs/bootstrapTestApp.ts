import * as cookieParser from "cookie-parser"
import prisma from "src/main/prisma"
import { INestApplication, Provider } from "@nestjs/common"
import { bootstrapTestModule } from "./bootstrapTestModule"

export async function bootstrapTestApp(
  providers: Provider[] = [],
): Promise<INestApplication> {
  const testModule = await bootstrapTestModule(providers)
  const app = testModule.createNestApplication()
  await prisma(app)
  app.use(cookieParser())
  return app
}
