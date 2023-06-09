import { makeError, errorHandler } from './error-handler'
import { ApiError } from './ApiError'
import { Request, Response, NextFunction } from 'express'

export const doMock = (): { req: Request, res: Response, next: NextFunction } => {
  const req = {} as any as Request
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
  const next = jest.fn() as any as NextFunction
  return { req, res, next }
}

describe('ErrorHandling errorHandler', () => {
  it('should return 500 INTERNAL', () => {
    const { req, res, next } = doMock()
    errorHandler(Error(), req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong', code: 500 })
  })
  it('should return 422 BAD REQUEST', () => {
    const { req, res, next } = doMock()
    errorHandler(ApiError.badRequest(), req, res, next)
    expect(res.status).toHaveBeenCalledWith(422)
    expect(res.json).toHaveBeenCalledWith({ message: 'Bad request', code: 422 })
  })
  it('should return 404 NOT FOUND', () => {
    const { req, res, next } = doMock()
    errorHandler(ApiError.notFound(), req, res, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found', code: 404 })
  })
})

describe('ErrorHandling makeError', () => {
  it('should return a 500 error', () => {
    const error = makeError(500, 'Something went wrong')
    expect(error).toEqual({
      code: 500,
      message: 'Something went wrong'
    })
  })
  it('should return a 422 error', () => {
    const error = makeError(422, 'Bad request')
    expect(error).toEqual({
      code: 422,
      message: 'Bad request'
    })
  })
  it('should return a 404 error', () => {
    const error = makeError(404, 'Not found')
    expect(error).toEqual({
      code: 404,
      message: 'Not found'
    })
  })
})
