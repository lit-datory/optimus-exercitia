import { input } from "zod"
import { type authResponseSchema } from "../schemas"

export type AuthResponse = input<typeof authResponseSchema>
