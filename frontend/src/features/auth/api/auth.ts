import { nonAuthorizedApi } from "src/lib/axios"
import { HttpMethods } from "src/types"
import { parseCookie } from "src/utils"
import { authResponseSchema } from "../schemas"
import { AuthResponse } from "../types"

export const login = async ({ email, password }: { email: string; password: string }) => {
  const response = await nonAuthorizedApi<AuthResponse>("/auth/login", {
    method: HttpMethods.POST,
    data: { email, password },
    withCredentials: true,
  })
  return authResponseSchema.parse(response.data)
}

export const logout = async () => {
  return await nonAuthorizedApi("/auth/logout", { method: HttpMethods.POST, withCredentials: true })
}

export const refreshToken = async () => {
  const csrfToken = parseCookie(document.cookie, "_csrf")
  const response = await nonAuthorizedApi<AuthResponse>("/auth/refresh_token", {
    headers: { "X-CSRF-TOKEN": csrfToken },
    method: HttpMethods.POST,
    withCredentials: true,
  })
  return authResponseSchema.parse(response.data)
}
