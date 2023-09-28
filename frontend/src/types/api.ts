export type UrlParams = string | URLSearchParams | Record<string, string> | string[][]

export enum HttpMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}
