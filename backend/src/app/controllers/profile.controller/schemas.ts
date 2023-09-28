import { string, object, boolean } from "zod"

export const getProfileResponseSchema = object({
  id: string().uuid(),
  firstName: string(),
  lastName: string(),
  blocked: boolean(),
  updatedAt: string(),
  createdAt: string(),
  email: string().email(),
})
