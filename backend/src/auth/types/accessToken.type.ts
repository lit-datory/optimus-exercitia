import { output, input } from "zod"
import { accessTokenSchema } from "../schemas"

export type AccessTokenPayload = input<typeof accessTokenSchema>
export type CurrentAccessToken = output<typeof accessTokenSchema>
