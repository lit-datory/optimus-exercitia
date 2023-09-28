import { object, string } from "zod"

export const accessTokenSchema = object({
  sub: string().uuid(),
  email: string().email(),
}).transform((data) => ({
  id: data.sub,
  email: data.email,
}))
