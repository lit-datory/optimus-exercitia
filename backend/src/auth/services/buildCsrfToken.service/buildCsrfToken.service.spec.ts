import { TestingModule } from "@nestjs/testing"
import { bootstrapTestModule } from "src/utils/specs"
import { BuildCsrfTokenService } from "./buildCsrfToken.service"

describe("BuildCsrfTokenService", () => {
  let module: TestingModule
  let buildCsrfTokenService: BuildCsrfTokenService

  beforeAll(async () => {
    module = await bootstrapTestModule()
    buildCsrfTokenService = module.get<BuildCsrfTokenService>(
      BuildCsrfTokenService,
    )
  })

  it("should be defined", () => {
    expect(buildCsrfTokenService).toBeDefined()
  })

  it("should successfully build a session token", () => {
    const result = buildCsrfTokenService.execute()
    expect(result).toBeDefined()
    const splittedResult = result.split(".")
    expect(splittedResult).toHaveLength(3)
  })
})
