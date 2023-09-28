import { input } from "zod"
import { profileResponseSchema } from "../schemas"

export type ProfileResponse = input<typeof profileResponseSchema>
