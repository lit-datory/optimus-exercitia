import { boolean, object, string } from "zod"

export const profileResponseSchema = object({
  id: string().uuid(),
  firstName: string(),
  lastName: string(),
  blocked: boolean(),
  updatedAt: string(),
  createdAt: string(),
  email: string(),
})
