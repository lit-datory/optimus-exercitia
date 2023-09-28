import { object, string } from "zod"

export const authResponseSchema = object({
  accessToken: string(),
})
