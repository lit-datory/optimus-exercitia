import { Controller, Get } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  PrismaHealthIndicator,
} from "@nestjs/terminus"
import { ConfigService } from "src/config/services/config.service"
import { PrismaService } from "src/prisma/prisma.service"

@ApiTags("Monitoring")
@Controller("health")
export class HealthController {
  constructor(
    private config: ConfigService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @ApiOperation({ description: "Pings frontend url & database" })
  @Get()
  @HealthCheck()
  public async index() {
    const checks = this.getChecks()
    return await this.health.check(checks)
  }

  private getChecks() {
    const frontendUrl = this.config.get("FRONTEND_URL")
    const isTest = this.config.isTest()
    const checks = [
      async () => await this.db.pingCheck("database", this.prisma),
    ]

    if (frontendUrl && !isTest) {
      return [
        ...checks,
        async () => await this.http.pingCheck("frontend", frontendUrl),
      ]
    }

    return checks
  }
}
