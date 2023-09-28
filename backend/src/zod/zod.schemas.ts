import { array, number, object, string } from "zod"

const zodErrorSchema = array(
  object({
    code: string(),
    keys: string().array().optional(),
    expected: string().optional(),
    received: string().optional(),
    path: string().array(),
    message: string(),
  }),
).default([
  {
    code: "invalid_type",
    expected: "string",
    received: "undefined",
    path: ["interestRate"],
    message: "Required",
  },
  {
    code: "unrecognized_keys",
    keys: ["random"],
    path: [],
    message: "Unrecognized key(s) in object: 'random'",
  },
])

export const unauthorizedSchema = object({
  statusCode: number().default(401),
  message: string().default("Unauthorized"),
})

export const notFoundSchema = object({
  statusCode: number().default(404),
  message: string().default("Not Found"),
})

export const badRequestSchema = object({
  statusCode: number().default(400),
  message: string().default("Error message").or(zodErrorSchema),
  error: string().default("Bad Request"),
})

export const forbiddenSchema = object({
  statusCode: number().default(403),
  message: string().default("Forbidden resource"),
  error: string().default("Forbidden"),
})
