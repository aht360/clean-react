import faker from '@faker-js/faker'
import { HttpPostClient, HttpPostParams, HttpResponse, HttpStatusCode } from '@/data/protocols/http'

export const mockPostRequest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: faker.helpers.objectValue({})
})

export class HttpPostClientSpy<T, R> implements HttpPostClient<T, R> {
    url?: string
    body?: T
    response: HttpResponse<R> = {
      statusCode: HttpStatusCode.OK
    }

    async post (params: HttpPostParams<T>): Promise<HttpResponse<R>> {
      this.url = params.url
      this.body = params.body
      return Promise.resolve(this.response)
    }
}
