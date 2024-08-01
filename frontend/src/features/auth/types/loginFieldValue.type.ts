import { input } from "zod"
import { type loginFieldValuesSchema } from "../schemas"

export type LoginFieldValues = input<typeof loginFieldValuesSchema>
