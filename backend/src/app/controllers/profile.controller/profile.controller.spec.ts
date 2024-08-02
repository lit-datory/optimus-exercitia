import { JwtAuthGuard } from "src/auth/guards"
import { ProfileController } from "./profile.controller"

describe("ProfileController", () => {
  it("has JwtAuthGuard", () => {
    const guards = Reflect.getMetadata(
      "__guards__",
      ProfileController,
    ) as Array<new () => void>
    const guard = new guards[0]()

    expect(guard).toBeInstanceOf(JwtAuthGuard)
  })
})
