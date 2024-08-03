import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios"
import { refreshToken } from "src/features/auth/api"
import { accessTokenAtom } from "src/features/auth/store"
import { router } from "src/routes"
import { defaultStore } from "src/store"

export function requestInterceptor(config: InternalAxiosRequestConfig) {
  const newConfig: InternalAxiosRequestConfig = config
  const accessToken = getAccessToken()
  if (accessToken) {
    newConfig.headers.Authorization = `Bearer ${accessToken}`
  }
  return newConfig
}

export function responseInterceptor(response: AxiosResponse) {
  return response
}

export async function responseErrorInterceptor(error: AxiosError) {
  if (error.response?.status !== 401) return Promise.reject(error)
  return await refresh(error)
}

function getAccessToken() {
  return defaultStore.get(accessTokenAtom)
}

async function refresh(requestError: AxiosError) {
  try {
    const { accessToken } = await refreshToken()
    defaultStore.set(accessTokenAtom, accessToken)
    const { config } = requestError
    if (config) {
      config.headers.Authorization = `Bearer ${accessToken}`
      return await axios.request(config)
    }
  } catch {
    return router.navigate("/logout")
  }
}
