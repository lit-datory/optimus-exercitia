import { INestApplication } from "@nestjs/common"
import { PrismaInterceptor, PrismaService } from "src/prisma"

export default async function prisma(app: INestApplication) {
  await app.get(PrismaService).$enableShutdownHooks(app)
  app.useGlobalInterceptors(new PrismaInterceptor())
}
