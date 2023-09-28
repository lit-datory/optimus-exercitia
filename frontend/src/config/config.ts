import { schema } from "./config.schema"

export const config = schema.parse(import.meta.env)
