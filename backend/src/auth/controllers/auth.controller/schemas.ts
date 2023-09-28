import { object, string } from "zod"

export const loginBodySchema = object({
  email: string()
    .email()
    .transform((e) => e.toLowerCase()),
  password: string().min(1),
})

export const authResponseSchema = object({
  accessToken: string(),
})

export const logoutResponseSchema = string().default("successfully logged out!")
