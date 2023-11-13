import { applyDecorators, UseInterceptors, UsePipes } from "@nestjs/common"
import { ApiBody, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger"
import { ZodSchema } from "zod"
import { TransformInterceptor } from "./zod.interceptor"
import { ZodValidationPipe } from "./zod.pipe"
import { Schema } from "./zod.types"
import { zodToJson } from "./zod.utils"
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface"

export function UseSchema(schema: Schema) {
  return applyDecorators(
    UsePipes(new ZodValidationPipe(schema)),
    ...applyParamDecorators(schema),
    ...applyQueryDecorators(schema),
    ...applyBodyDecorators(schema),
    ...applyResponseDecorators(schema),
  )
}

function applyQueryDecorators({ query }: Schema) {
  if (!query) return []
  const z = zodToJson(query)

  const properties: SchemaObject | undefined = z.properties

  if (!properties) return []

  const requiredFields = z.required ?? []
  return Object.entries(properties).map(
    ([name, { type, description, items }]) => {
      const isArray = type === "array"
      const required = requiredFields.includes(name)

      if (isArray) {
        return ApiQuery({
          name,
          type,
          schema: { type, items },
          description,
          required,
        })
      }

      return ApiQuery({
        name,
        type,
        description,
        required,
      })
    },
  )
}

function applyBodyDecorators({ body }: Schema) {
  if (!body) return []
  return [ApiBody({ schema: zodToJson(body) })]
}

function applyParamDecorators({ param }: Schema) {
  if (!param) return []
  if (!("shape" in param))
    return [ApiParam({ name: "param", schema: zodToJson(param) })]

  const attributes = param.shape as Record<string, ZodSchema>
  return Object.keys(attributes).map((attribute) => {
    return ApiParam({
      name: attribute,
      schema: zodToJson(attributes[attribute]),
    })
  })
}

function applyResponseDecorators({ response }: Schema) {
  if (!response) return []

  const statuses = Object.keys(response) as unknown as number[]
  return statuses.reduce(
    (decorators, status) => {
      const schema = response[status]

      return [
        ...decorators,
        ApiResponse({ status: Number(status), schema: zodToJson(schema) }),
        UseInterceptors(new TransformInterceptor(schema, Number(status))),
      ]
    },
    [] as Array<MethodDecorator | ClassDecorator>,
  )
}
