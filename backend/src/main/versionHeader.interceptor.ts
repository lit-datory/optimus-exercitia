import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common"
import { Observable } from "rxjs"
import { Response } from "express"
import { version } from "../../package.json"

@Injectable()
export class VersionHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response: Response = context.switchToHttp().getResponse()
    response.setHeader("x-version", version)
    return next.handle()
  }
}
