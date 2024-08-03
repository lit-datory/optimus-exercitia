import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common"
import { Schema } from "./zod.types"

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type === "query") return this.transformQuery(value)
    if (metadata.type === "param") return this.transformParam(value)
    if (metadata.type === "body") return this.transformBody(value)

    return value
  }

  private transformQuery(value: unknown): unknown {
    if (!this.schema.query) return value

    const result = this.schema.query.safeParse(value)
    if (result.success) return result.data

    throw new BadRequestException([...result.error.issues])
  }

  private transformParam(value: unknown): unknown  {
    if (!this.schema.param) return value

    const result = this.schema.param.safeParse(value)
    if (result.success) return result.data

    throw new BadRequestException([...result.error.issues])
  }

  private transformBody(value: unknown): unknown  {
    if (!this.schema.body) return value

    const result = this.schema.body.safeParse(value)
    if (result.success) return result.data

    throw new BadRequestException([...result.error.issues])
  }
}
