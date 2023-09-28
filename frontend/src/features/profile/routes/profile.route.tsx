import { Suspense } from "react"
import { Profile } from "../components"

export const ProfileRoute = () => {
  return (
    <Suspense>
      <Profile />
    </Suspense>
  )
}
