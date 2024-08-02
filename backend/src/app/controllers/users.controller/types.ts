import { output } from "zod"
import { type createUserBodySchema } from "./schemas"

export type CreateUserBody = output<typeof createUserBodySchema>
