import { output } from "zod"
import { type loginBodySchema, type authResponseSchema } from "./schemas"

export type LoginBody = output<typeof loginBodySchema>
export type AuthResponse = output<typeof authResponseSchema>
