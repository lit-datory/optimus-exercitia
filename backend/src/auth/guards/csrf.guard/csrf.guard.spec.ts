import { ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { TestingModule } from "@nestjs/testing"
import { BuildCsrfTokenService } from "src/auth/services/buildCsrfToken.service"
import { bootstrapTestModule } from "src/utils/specs"
import { CsrfGuard } from "./csrf.guard"

describe("CsrfGuard", () => {
  let module: TestingModule
  let buildCsrfTokenService: BuildCsrfTokenService
  let csrfGuard: CsrfGuard

  beforeAll(async () => {
    module = await bootstrapTestModule()
    csrfGuard = await module.resolve(CsrfGuard)
    buildCsrfTokenService = await module.resolve(BuildCsrfTokenService)
  })

  it("returns true", () => {
    const csrfToken = buildCsrfTokenService.execute()
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          cookies: { _csrf: csrfToken },
          headers: { "x-csrf-token": csrfToken },
        }),
      }),
    } as unknown as ExecutionContext

    expect(csrfGuard.canActivate(mockExecutionContext)).toBeTruthy()
  })

  it("throws UnauthorizedException - invalid token in _csrf cookie", () => {
    const csrfToken = buildCsrfTokenService.execute()
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          cookies: { _csrf: "invalid" },
          headers: { "x-csrf-token": csrfToken },
        }),
      }),
    } as unknown as ExecutionContext

    expect(() => csrfGuard.canActivate(mockExecutionContext)).toThrow(
      new UnauthorizedException(),
    )
  })

  it("throws UnauthorizedException - invalid token in X-CSRF-TOKEN header", () => {
    const csrfToken = buildCsrfTokenService.execute()
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          cookies: { _csrf: csrfToken },
          headers: { "x-csrf-token": "invalid" },
        }),
      }),
    } as unknown as ExecutionContext

    expect(() => csrfGuard.canActivate(mockExecutionContext)).toThrow(
      new UnauthorizedException(),
    )
  })

  it("throws UnauthorizedException - invalid token in _csrf cookie & X-CSRF-TOKEN header", () => {
    const csrfToken = buildCsrfTokenService.execute()
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          cookies: { _csrf: `${csrfToken}z` },
          headers: { "x-csrf-token": `${csrfToken}z` },
        }),
      }),
    } as unknown as ExecutionContext

    expect(() => csrfGuard.canActivate(mockExecutionContext)).toThrow(
      new UnauthorizedException(),
    )
  })

  it("throws UnauthorizedException - csrf tokens are different", () => {
    const csrfToken = buildCsrfTokenService.execute()
    const csrfToken2 = buildCsrfTokenService.execute()
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          cookies: { _csrf: csrfToken2 },
          headers: { "x-csrf-token": csrfToken },
        }),
      }),
    } as unknown as ExecutionContext

    expect(() => csrfGuard.canActivate(mockExecutionContext)).toThrow(
      new UnauthorizedException(),
    )
  })

  it("throws UnauthorizedException - invalid token in x-csrf-token header", () => {
    const csrfToken = buildCsrfTokenService.execute()
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          cookies: { _csrf: csrfToken },
          headers: { "x-csrf-token": "invalid" },
        }),
      }),
    } as unknown as ExecutionContext

    expect(() => csrfGuard.canActivate(mockExecutionContext)).toThrow(
      new UnauthorizedException(),
    )
  })

  it("throws UnauthorizedException - _csrf cookie missing", () => {
    const csrfToken = buildCsrfTokenService.execute()
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { "x-csrf-token": csrfToken },
        }),
      }),
    } as unknown as ExecutionContext

    expect(() => csrfGuard.canActivate(mockExecutionContext)).toThrow(
      new UnauthorizedException(),
    )
  })

  it("throws UnauthorizedException - X-CSRF-TOKEN header missing", () => {
    const csrfToken = buildCsrfTokenService.execute()
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          cookies: { _csrf: csrfToken },
        }),
      }),
    } as unknown as ExecutionContext

    expect(() => csrfGuard.canActivate(mockExecutionContext)).toThrow(
      new UnauthorizedException(),
    )
  })

  it("throws UnauthorizedException - X-CSRF-TOKEN header & _csrf cookie missing", () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
    } as unknown as ExecutionContext

    expect(() => csrfGuard.canActivate(mockExecutionContext)).toThrow(
      new UnauthorizedException(),
    )
  })
})
