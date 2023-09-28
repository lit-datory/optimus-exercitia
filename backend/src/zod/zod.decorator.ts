import { applyDecorators, UseInterceptors, UsePipes } from "@nestjs/common"
import { ApiBody, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger"
import { ZodSchema } from "zod"
import { TransformInterceptor } from "./zod.interceptor"
import { ZodValidationPipe } from "./zod.pipe"
import { Schema } from "./zod.types"
import { zodToJson } from "./zod.utils"

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
  if (!("shape" in query))
    return [ApiQuery({ name: "query", schema: zodToJson(query) })]

  const attributes = query.shape as Record<string, ZodSchema>
  return Object.keys(attributes).map((attribute) => {
    return ApiQuery({
      name: attribute,
      schema: zodToJson(attributes[attribute]),
    })
  })
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
