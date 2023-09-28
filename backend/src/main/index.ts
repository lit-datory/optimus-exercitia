import * as cookieParser from "cookie-parser"
import helmet from "helmet"
import { NestFactory } from "@nestjs/core"
import { MainModule } from "./main.module"
import prisma from "./prisma"
import swagger from "./swagger"
import { ConfigService } from "src/config/services/config.service"

async function bootstrap() {
  const app = await NestFactory.create(MainModule)
  const config = app.get(ConfigService)

  await prisma(app)
  await swagger(app)

  app.use(cookieParser())
  app.use(helmet())
  app.enableCors({
    credentials: true,
    origin: config.get("FRONTEND_URL"),
  })

  await app.listen(3100)
}

void bootstrap()
