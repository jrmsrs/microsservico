import { mockNext, mockRequest, mockResponse } from '../utils/interceptor'
import { notFoundController } from './notFoundController'

describe('Controller notFoundController()', () => {
  it('should return 404 NOT FOUND', () => {
    const req = mockRequest() as any
    const res = mockResponse() as any
    const next = mockNext as any

    notFoundController(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      code: 404,
      message: 'Page not found'
    }))
  })

  it('should force an internal error if throw query param is set to 1', () => {
    const req = mockRequest() as any
    req.query = { throw: '1' }
    const res = mockResponse() as any
    const next = mockNext as any

    notFoundController(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      code: 500,
      message: 'Something went wrong'
    }))
  })
})
