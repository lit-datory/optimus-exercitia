import { INestApplication } from "@nestjs/common"
import { PrismaInterceptor } from "src/prisma"

export default function interceptors(app: INestApplication) {
  app.useGlobalInterceptors(new PrismaInterceptor())
}
