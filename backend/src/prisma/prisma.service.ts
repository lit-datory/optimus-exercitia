import { Injectable, OnModuleInit } from "@nestjs/common"
import { PrismaClient, Prisma } from "@prisma/client"
import { ConfigService } from "src/config/services/config.service"

type TableNameSelect = {
  tablename: string
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(protected readonly configService: ConfigService) {
    const logSql = configService.get("LOG_SQL")
    const logDefinitions: Prisma.LogLevel[] = logSql
      ? ["query", "info", "warn", "error"]
      : ["info", "warn", "error"]
    super({
      log: logDefinitions,
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  public async $truncateAll(): Promise<void> {
    const tableNames = await this.$getTableNames()
    const tables = tableNames.map((t) => `"public"."${t.tablename}"`)

    try {
      await this.$executeRawUnsafe(
        `TRUNCATE TABLE ${tables.join(",")} CASCADE;`,
      )
    } catch (error) {
      console.error({ error })
    }
  }

  public async $getTableNames(): Promise<TableNameSelect[]> {
    return await this.$queryRaw<TableNameSelect[]>`
      SELECT
        tablename FROM pg_tables
      WHERE schemaname='public'
      AND pg_tables.tablename NOT IN ('_prisma_migrations')
    `
  }
}
