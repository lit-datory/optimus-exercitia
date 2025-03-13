import { z, ZodSchema } from "zod"
import { generateMock } from "@anatine/zod-mock"
import { BaseFactory } from "src/factories/base.factory"

export default function createZodFactory<Schema extends ZodSchema>(
  schema: Schema,
) {
  return class ZodFactory extends BaseFactory<
    z.input<Schema>,
    z.output<Schema>
  > {
    // eslint-disable-next-line @typescript-eslint/require-await
    public async save(_data: z.output<Schema>): Promise<z.output<Schema>> {
      throw Error("not implemented")
    }

    public generate(): z.output<Schema> {
      // no idea why eslint thinks return is type any here..., typecript clearly shows it is typed.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return generateMock(schema)
    }
  }
}
