import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../error/ApiError'
import * as NotFoundController from './notFoundController'

describe('notFoundController', () => {
  it('should return a 404 error', async () => {
    const mockRequest: Request = {} as any as Request
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response
    const mockNext = jest.fn() as any as NextFunction
    await (NotFoundController.notFoundController(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
    expect(mockResponse.status).toBeCalledTimes(0)
    expect(mockResponse.json).toBeCalledTimes(0)
    expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Page not found'))
  })

  it('should return a 500 error', async () => {
    const mockRequest: Request = {
      query: {
        throw: true
      }
    } as any as Request
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response
    const mockNext = jest.fn() as any as NextFunction
    await (NotFoundController.notFoundController(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
    expect(mockResponse.status).toBeCalledTimes(0)
    expect(mockResponse.json).toBeCalledTimes(0)
    expect(mockNext).toHaveBeenCalledWith(ApiError.internal())
  })
})
