import { input } from "zod"
import { type profileResponseSchema } from "../schemas"

export type ProfileResponse = input<typeof profileResponseSchema>
