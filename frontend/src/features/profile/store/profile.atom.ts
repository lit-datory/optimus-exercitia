import { refetchableAtom } from "src/lib/jotai"
import { getProfile } from "../api/profile"

export const profileAtom = refetchableAtom(async () => {
  return await getProfile()
})
