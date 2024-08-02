import cookieParser from "cookie-parser"
import helmet from "helmet"
import { NestFactory } from "@nestjs/core"
import { MainModule } from "./main.module"
import swagger from "./swagger"
import { ConfigService } from "src/config/services/config.service"
import interceptors from "./interceptors"
import { NestExpressApplication } from "@nestjs/platform-express"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule)
  const config = app.get(ConfigService)

  const frontendUrl = config.get("FRONTEND_URL")
  const allowedCorsOriginUrls = config.get("ALLOWED_CORS_ORIGIN_URLS") ?? []
  const corsWhitelist = [frontendUrl, ...allowedCorsOriginUrls]

  swagger(app)

  interceptors(app)

  app.use(cookieParser())
  app.use(helmet())
  app.enableCors({
    credentials: true,
    origin: corsWhitelist,
  })

  app.enableShutdownHooks()

  await app.listen(3100)
}

void bootstrap()
