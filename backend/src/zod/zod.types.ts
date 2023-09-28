import { ZodSchema } from "zod"

export type Schema = {
  param?: ZodSchema
  query?: ZodSchema
  body?: ZodSchema
  response?: Record<number, ZodSchema>
}
