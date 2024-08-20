import { object, string, z } from "zod"

export const configSchema = object({
  DATABASE_URL: string(),
  FRONTEND_URL: string().url(),
  SWAGGER_TITLE: string().default(""),
  SWAGGER_DESCRIPTION: string().default(""),
  SWAGGER_VERSION: string().default(""),
  JWT_SECRET_KEY: string(),
  JWT_ACCESS_TOKEN_EXPIRE_TIME: z.coerce
    .number()
    .transform((v) => v.toString()),
  JWT_REFRESH_TOKEN_EXPIRE_TIME: z.coerce
    .number()
    .transform((v) => v.toString()),
  HTTP_COOKIE_EXPIRE_TIME: z.coerce.number().transform((v) => v.toString()),
  HTTP_COOKIE_DOMAIN: string(),
  HTTP_COOKIE_SAME_SITE: z.enum(["Strict", "Lax", "None"]),
  CSRF_TOKEN_SECRET_KEY: string(),
  ALLOWED_CORS_ORIGIN_URLS: string()
    .optional()
    .transform((value) => value && value.trim().split(","))
    .pipe(z.string().url().array())
    .optional(),
  LOG_SQL: z
    .enum(["true", "false"])
    .transform((v) => {
      if (v === "true") return true
      return false
    })
    .default("false"),
})
