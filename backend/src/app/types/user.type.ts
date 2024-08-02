import { output } from "zod"
import { type userSchema } from "../schemas"

export type User = output<typeof userSchema>
