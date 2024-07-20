import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { mockRefreshToken } from "src/features/auth/api"
import { requestInterceptor, responseErrorInterceptor } from "./interceptors"

vi.mock("jotai", async () => {
  const actual = (await vi.importActual("jotai")) as unknown as Record<string, unknown>
  return {
    ...actual,
    getDefaultStore: vi.fn(() => {
      return {
        get: vi.fn().mockReturnValue("testToken"),
        set: vi.fn(),
      }
    }),
  }
})

vi.mock("src/routes",  () => {
  return {
    router: {
      navigate: vi.fn(),
    },
  }
})

describe("Interceptors", () => {
  describe("requestInterceptor", () => {
    it("Sets Authorization header",  () => {
      const config = requestInterceptor({ headers: {} } as InternalAxiosRequestConfig)
      expect(config.headers.Authorization).toEqual("Bearer testToken")
    })
  })

  describe("responseErrorInterceptor", () => {
    it("refreshes token when api responds with 401",  async () => {
      const m = vi
        .spyOn(axios, "request")
        .mockImplementation(async <T = unknown, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> => {
          return await Promise.resolve({
            headers: config.headers as AxiosHeaders,
          }) as R
        })
      const mock = mockRefreshToken({ resolve: { accessToken: "test" } })
      await responseErrorInterceptor({ response: { status: 401 }, config: { headers: {} } } as AxiosError)
      expect(m).toHaveResolvedWith({ headers: { Authorization: "Bearer test" } })
      expect(mock).toHaveBeenCalled()
    })

    it("throws error when api does not return 401", async () => {
      await expect(
        responseErrorInterceptor({
          response: { status: 400 },
        } as AxiosError),
      ).rejects.toThrowError()
    })
  })
})
