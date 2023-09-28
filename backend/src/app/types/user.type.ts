import { output } from "zod"
import { userSchema } from "../schemas"

export type User = output<typeof userSchema>
