import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  NotFoundException,
} from "@nestjs/common"
import { catchError, Observable } from "rxjs"

// Prisma error codes:
// https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
export class PrismaInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error: Error & { code: string }) => {
        switch (error.code) {
          case "P2025":
            throw new NotFoundException()
          default:
            throw error
        }
      }),
    )
  }
}
