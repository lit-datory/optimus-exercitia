import { CsrfGuard } from "src/auth/guards"
import { AuthController } from "./auth.controller"

describe("AuthController", () => {
  it("refreshToken action has CsrfGuard", () => {
    const guards = Reflect.getMetadata(
      "__guards__",
      // eslint-disable-next-line @typescript-eslint/unbound-method
      AuthController.prototype.refreshToken,
    ) as Array<new () => void>

    expect(guards).toEqual([CsrfGuard])
  })
})
