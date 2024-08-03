import { BuildCsrfTokenService } from "src/auth/services/buildCsrfToken.service"
import { VerifyCsrfTokenService } from "./verifyCsrfToken.service"
import { UnauthorizedException } from "@nestjs/common"
import { createHmac } from "crypto"
import { bootstrapTestModule } from "src/utils/specs"
import { TestingModule } from "@nestjs/testing"

describe("VerifyCsrfTokenService", () => {
  let module: TestingModule
  let buildCsrfTokenService: BuildCsrfTokenService
  let verifyCsrfTokenService: VerifyCsrfTokenService

  beforeAll(async () => {
    module = await bootstrapTestModule()
    buildCsrfTokenService = module.get<BuildCsrfTokenService>(
      BuildCsrfTokenService,
    )
    verifyCsrfTokenService = module.get<VerifyCsrfTokenService>(
      VerifyCsrfTokenService,
    )
  })

  it("should be defined", () => {
    expect(verifyCsrfTokenService).toBeDefined()
  })

  it("should successfully verfiy a csrf token", () => {
    const token = buildCsrfTokenService.execute()
    const isVerified = verifyCsrfTokenService.execute(token)
    expect(isVerified).toBeTruthy()
  })

  it("should fail validating the csrf token", () => {
    expect(() => verifyCsrfTokenService.execute("sessionId.expiresIn")).toThrow(
      UnauthorizedException,
    )
  })

  it("should fail validating the csrf token because it expired", () => {
    const expiresIn = (Math.floor(Date.now() / 1000) - 1000).toString()
    expect(() =>
      verifyCsrfTokenService.execute(`sessionId.${expiresIn}.hash`),
    ).toThrow(UnauthorizedException)
  })

  it("should fail verifying the csrf token because hash is invalid", () => {
    const hmac = createHmac("sha256", "test")
    hmac.update("test")
    const hash = hmac.digest("base64")
    const expiresIn = (Math.floor(Date.now() / 1000) + 5000).toString()
    const isVerified = verifyCsrfTokenService.execute(
      `sessionId.${expiresIn}.${hash}`,
    )
    expect(isVerified).toBeFalsy()
  })
})
