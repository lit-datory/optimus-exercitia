import { input } from "zod"
import { authResponseSchema } from "../schemas"

export type AuthResponse = input<typeof authResponseSchema>
