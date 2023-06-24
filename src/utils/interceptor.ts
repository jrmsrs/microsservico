// interceptador para mockar express reqs e resps
// Referência: https://stackoverflow.com/a/57081471

import { Request, Response, NextFunction } from 'express'

interface MockRequest {
  body: jest.Mock<any, any>
  params: jest.Mock<any, any>
}

interface MockResponse {
  send: jest.Mock<any, any>
  status: jest.Mock<any, any>
  json: jest.Mock<any, any>
  redirect: jest.Mock<any, any>
  get: jest.Mock<any, any>
  statusCode?: number
}

const mockRequest = (): MockRequest => {
  const req: MockRequest = {
    body: jest.fn().mockReturnThis(),
    params: jest.fn().mockReturnThis()
  }
  return req
}

const mockResponse = (): MockResponse => {
  const res: MockResponse = {
    send: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis()
  }
  return res
}

export const doMock = (id?: any, body?: any): { req: Request, res: Response, next: NextFunction } => {
  jest.clearAllMocks()
  jest.resetAllMocks()
  jest.resetModules()
  const req = mockRequest() as any
  req.params.id = id
  req.body = body
  const res = mockResponse() as any
  const next = mockNext as any
  return { req, res, next }
}

export const mockNext = jest.fn()
