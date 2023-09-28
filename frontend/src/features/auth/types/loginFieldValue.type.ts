import { input } from "zod"
import { loginFieldValuesSchema } from "../schemas"

export type LoginFieldValues = input<typeof loginFieldValuesSchema>
