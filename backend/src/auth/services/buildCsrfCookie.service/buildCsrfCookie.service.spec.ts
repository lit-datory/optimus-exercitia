import { TestingModule } from "@nestjs/testing"
import { bootstrapTestModule } from "src/utils/specs"
import { BuildCsrfCookieService } from "./buildCsrfCookie.service"

describe("BuildCsrfCookieService", () => {
  let module: TestingModule
  let buildCsrfCookieService: BuildCsrfCookieService

  beforeAll(async () => {
    module = await bootstrapTestModule()
    buildCsrfCookieService = module.get<BuildCsrfCookieService>(
      BuildCsrfCookieService,
    )
  })

  it("should be defined", () => {
    expect(buildCsrfCookieService).toBeDefined()
  })

  it("should successfully build a csrf cookie", () => {
    const result = buildCsrfCookieService.execute("token")
    expect(result).toBeDefined()
  })
})
