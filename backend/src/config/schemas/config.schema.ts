import { object, string, z } from "zod"

export const configSchema = object({
  DATABASE_URL: string(),
  FRONTEND_URL: string().url(),
  SWAGGER_TITLE: string().default(""),
  SWAGGER_DESCRIPTION: string().default(""),
  SWAGGER_VERSION: string().default(""),
  JWT_SECRET_KEY: string(),
  JWT_ACCESS_TOKEN_EXPIRE_TIME: string().transform((v) => Number(v)),
  JWT_REFRESH_TOKEN_EXPIRE_TIME: string().transform((v) => Number(v)),
  HTTP_COOKIE_EXPIRE_TIME: string().transform((v) => Number(v)),
  HTTP_COOKIE_DOMAIN: string(),
  CSRF_TOKEN_SECRET_KEY: string(),
  LOG_SQL: z
    .enum(["true", "false"])
    .transform((v) => {
      if (v === "true") return true
      return false
    })
    .default("false"),
})
