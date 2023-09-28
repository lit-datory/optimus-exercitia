import { zodToJsonSchema } from "zod-to-json-schema"
import { ZodType } from "zod"
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface"

export function zodToJson(schema: ZodType) {
  return zodToJsonSchema(schema, { target: "openApi3" }) as SchemaObject
}
