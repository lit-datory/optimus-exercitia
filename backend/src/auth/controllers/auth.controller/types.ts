import { output } from "zod"
import { loginBodySchema } from "./schemas"

export type LoginBody = output<typeof loginBodySchema>
