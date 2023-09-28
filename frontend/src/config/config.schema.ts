import { object, output, string } from "zod"

export const schema = object({
  VITE_API_URL: string().url(),
})

export type Config = output<typeof schema>
