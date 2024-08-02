import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common"
import { Observable } from "rxjs"
import { Response } from "express"
import { map } from "rxjs/operators"
import { ZodSchema } from "zod"

export interface Data<T> {
  data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Data<T>> {
  constructor(
    private schema: ZodSchema,
    private statusCode: number,
  ) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Data<T>> | Promise<Observable<Data<T>>> {
    const http = context.switchToHttp()
    const response = http.getResponse<Response>()
    if (response.statusCode !== this.statusCode) return next.handle()

    return next.handle().pipe(map((data) => this.transformResponse(data)))
  }

  private transformResponse(data: unknown) {
    const jsonReadyData: unknown = JSON.parse(JSON.stringify(data))
    const result: unknown = this.schema.parse(jsonReadyData)
    return result as Data<T>
  }
}
