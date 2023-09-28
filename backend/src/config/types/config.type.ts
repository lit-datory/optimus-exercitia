import { output } from "zod"
import { configSchema } from "../schemas"

export type Config = output<typeof configSchema>
