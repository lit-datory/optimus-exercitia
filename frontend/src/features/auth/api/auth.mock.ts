import * as auth from "./auth"
import { AuthResponse } from "../types"
import { AxiosResponse } from "axios"

type Data = {
  resolve?: AuthResponse
  reject?: unknown
}

export const mockLogin = ({ resolve, reject }: Data) => {
  return vi.spyOn(auth, "login").mockReturnValue(
    new Promise((resolves, rejects) => {
      if (resolve) return resolves(resolve as AuthResponse)

      if (reject) return rejects(reject)
    }),
  )
}

export const mockLogout = () => {
  return vi.spyOn(auth, "logout").mockReturnValue(
    new Promise((resolves) => {
      return resolves("successfully logged out!" as unknown as AxiosResponse)
    }),
  )
}

export const mockRefreshToken = ({ resolve, reject }: Data) => {
  return vi.spyOn(auth, "refreshToken").mockReturnValue(
    new Promise((resolves, rejects) => {
      if (resolve) return resolves(resolve as AuthResponse)

      if (reject) return rejects(reject)
    }),
  )
}
