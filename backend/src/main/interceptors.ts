import { INestApplication } from "@nestjs/common"
import { VersionHeaderInterceptor } from "./versionHeader.interceptor"
import { PrismaInterceptor } from "src/prisma"

export default function interceptors(app: INestApplication) {
  app.useGlobalInterceptors(
    new VersionHeaderInterceptor(),
    new PrismaInterceptor(),
  )
}
