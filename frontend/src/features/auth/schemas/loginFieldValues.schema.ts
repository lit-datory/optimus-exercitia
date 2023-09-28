import { object, string } from "zod"

export const loginFieldValuesSchema = object({
  email: string().email({ message: "common.validations.email" }).min(1, { message: "common.validations.required" }),
  password: string().min(1, { message: "common.validations.required" }),
})
