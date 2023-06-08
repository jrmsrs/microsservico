import { makeError, errorHandler } from './error-handler'
import { mockNext, mockRequest, mockResponse } from '../utils/interceptor'
import { ApiError } from './ApiError'

describe('errorHandler()', () => {
  it('should return a 500 error', () => {
    const req = mockRequest() as any
    const res = mockResponse() as any
    const next = mockNext
    errorHandler(Error(), req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong', code: 500 })
  })
  it('should return a 400 error', () => {
    const req = mockRequest() as any
    const res = mockResponse() as any
    const next = mockNext
    errorHandler(ApiError.badRequest(), req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Bad request', code: 400 })
  })
  it('should return a 404 error', () => {
    const req = mockRequest() as any
    const res = mockResponse() as any
    const next = mockNext
    errorHandler(ApiError.notFound(), req, res, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found', code: 404 })
  })
})

describe('makeError()', () => {
  it('should return a 500 error', () => {
    const error = makeError(500, 'Something went wrong')
    expect(error).toEqual({
      code: 500,
      message: 'Something went wrong'
    })
  })
  it('should return a 400 error', () => {
    const error = makeError(400, 'Bad request')
    expect(error).toEqual({
      code: 400,
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