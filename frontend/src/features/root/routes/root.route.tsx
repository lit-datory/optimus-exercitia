import { Suspense } from "react"
import { LogoutButton } from "src/features/auth/components"
import { LanguageSelect } from "src/features/language/components"
import { Profile } from "src/features/profile/components"

export const RootRoute = () => {
  return (
    <main className="m-2">
      <Suspense>
        <LanguageSelect />
        <Profile />
        <LogoutButton />
      </Suspense>
    </main>
  )
}
