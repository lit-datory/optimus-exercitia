import { output } from "zod"
import { type configSchema } from "../schemas"

export type Config = output<typeof configSchema>
