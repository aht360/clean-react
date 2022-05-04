export enum HttpStatusCode {
  NO_CONTENT = 204,
  UNAUTHORIZED = 401,

}

export type HttpResponse = {
  statusCode: HttpStatusCode
  body?: object
}
