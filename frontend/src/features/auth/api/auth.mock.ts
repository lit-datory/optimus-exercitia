import * as auth from "./auth"
import { AuthResponse } from "../types"
import { AxiosResponse } from "axios"

type Data = {
  resolve?: AuthResponse
  reject?: string
}

export const mockLogin = ({ resolve, reject }: Data) => {
  return vi.spyOn(auth, "login").mockReturnValue(
    new Promise((resolves, rejects) => {
      if (resolve) { resolves(resolve); return; }

      if (reject) { rejects(new Error(reject)); return; }
    }),
  )
}

export const mockLogout = () => {
  return vi.spyOn(auth, "logout").mockReturnValue(
    new Promise((resolves) => {
      resolves("successfully logged out!" as unknown as AxiosResponse);
    }),
  )
}

export const mockRefreshToken = ({ resolve, reject }: Data) => {
  return vi.spyOn(auth, "refreshToken").mockReturnValue(
    new Promise((resolves, rejects) => {
      if (resolve) { resolves(resolve); return; }

      if (reject) { rejects(new Error(reject)); return; }
    }),
  )
}
