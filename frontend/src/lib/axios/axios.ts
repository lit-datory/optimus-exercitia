import axios, { AxiosInstance, AxiosStatic } from "axios"
import { config } from "../../config"
import { requestInterceptor, responseErrorInterceptor, responseInterceptor } from "./interceptors"

export const createApiInstance = (axios: AxiosStatic, url: string) => axios.create({ baseURL: url })

export const createProtectedInstance = (axiosInstance: AxiosStatic, url: string): AxiosInstance => {
  const instance = createApiInstance(axiosInstance, url)
  instance.interceptors.request.use(requestInterceptor)
  instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor)
  return instance
}

export const nonAuthorizedApi = createApiInstance(axios, config.VITE_API_URL)
export const authorizedApi = createProtectedInstance(axios, config.VITE_API_URL)
