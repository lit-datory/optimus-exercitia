import { date, object, string } from "zod"

export const refreshTokenSchema = object({
  id: string().uuid(),
  userAgent: string(),
  createdAt: date(),
  updatedAt: date(),
  userId: string().uuid(),
})
