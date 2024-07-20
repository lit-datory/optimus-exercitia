import { CsrfGuard } from "src/auth/guards"
import { AuthController } from "./auth.controller"

describe("AuthController", () => {
  it("refreshToken action has CsrfGuard", () => {
    const guards = Reflect.getMetadata(
      "__guards__",
      AuthController.prototype.refreshToken,
    )
    expect(guards).toEqual([CsrfGuard])
  })
})
