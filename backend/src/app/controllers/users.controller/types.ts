import { output } from "zod"
import { createUserBodySchema } from "./schemas"

export type CreateUserBody = output<typeof createUserBodySchema>
