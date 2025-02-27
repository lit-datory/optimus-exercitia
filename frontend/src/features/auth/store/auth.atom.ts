import { atom } from "jotai"
import { login, logout } from "../api"
import { LoginFieldValues } from "../types"
import { profileAtom } from "src/features/profile/store"

export const accessTokenAtom = atom<string | undefined>(undefined)

export const loginAtom = atom(null, async (_, set, data: LoginFieldValues) => {
  const { accessToken } = await login(data)
  set(accessTokenAtom, accessToken)
  await set(profileAtom)
})

export const logoutAtom = atom(null, async (_, set) => {
  set(accessTokenAtom, undefined)
  await logout()
})
