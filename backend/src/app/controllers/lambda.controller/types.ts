import { output } from "zod"
import { runLambdaBodySchema } from "./schemas"

export type RunLambdaBody = output<typeof runLambdaBodySchema>
