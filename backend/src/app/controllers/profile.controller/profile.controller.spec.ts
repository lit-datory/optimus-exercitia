import { JwtAuthGuard } from "src/auth/guards"
import { ProfileController } from "./profile.controller"

describe("ProfileController", () => {
  it("has JwtAuthGuard", async () => {
    const guards = Reflect.getMetadata("__guards__", ProfileController)
    const guard = new guards[0]()

    expect(guard).toBeInstanceOf(JwtAuthGuard)
  })
})
