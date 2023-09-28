import { boolean, object, string, ZodIssueCode } from "zod"

export const createUserBodySchema = object({
  firstName: string().min(1),
  lastName: string().min(1),
  email: string()
    .email()
    .transform((e) => e.toLowerCase()),
  password: string().min(5),
  passwordConfirmation: string(),
}).superRefine(({ password, passwordConfirmation }, ctx) => {
  if (password !== passwordConfirmation) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: "password does not match passwordConfirmation",
      path: ["password"],
    })
  }
})

export const createUserResponseSchema = object({
  id: string().uuid(),
  firstName: string(),
  lastName: string(),
  blocked: boolean(),
  updatedAt: string(),
  createdAt: string(),
  email: string().email(),
})
