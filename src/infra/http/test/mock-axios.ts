import faker from '@faker-js/faker'
import axios, { AxiosResponse } from 'axios'

export const mockHttpResponse = (): any => ({
    data: faker.helpers.objectValue({}),
    status: faker.datatype.number()
})

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  mockedAxios.post.mockResolvedValue(mockHttpResponse)

  return mockedAxios
}
