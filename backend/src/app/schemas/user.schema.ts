import { boolean, object, string, date } from "zod"

export const userSchema = object({
  id: string().uuid(),
  firstName: string(),
  lastName: string(),
  blocked: boolean().default(false),
  updatedAt: date(),
  createdAt: date(),
  email: string().email(),
})
