// interceptador para mockar express reqs e resps
// Referência: https://stackoverflow.com/a/57081471

interface MockRequest {
  body: jest.Mock<any, any>
  params: jest.Mock<any, any>
}

interface MockResponse {
  send: jest.Mock<any, any>
  status: jest.Mock<any, any>
  json: jest.Mock<any, any>
}

export const mockRequest = (): MockRequest => {
  const req: MockRequest = {
    body: jest.fn().mockReturnThis(),
    params: jest.fn().mockReturnThis()
  }
  return req
}

export const mockResponse = (): MockResponse => {
  const res: MockResponse = {
    send: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  }
  return res
}

export const mockNext = jest.fn()
