import { authorizedApi } from "src/lib/axios"
import { HttpMethods } from "src/types"
import { profileResponseSchema } from "../schemas"
import { ProfileResponse } from "../types"

export const getProfile = async () => {
  const response = await authorizedApi<ProfileResponse>("/profile", {
    method: HttpMethods.GET,
  })
  return profileResponseSchema.parse(response.data)
}
