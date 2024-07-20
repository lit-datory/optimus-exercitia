import { any, object, string } from "zod"

export const runLambdaBodySchema = object({ event: any() })

export const runLambdaResponseSchema = string()
