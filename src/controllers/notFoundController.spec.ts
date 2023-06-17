import { makeSut } from '../utils/interceptor'
import { notFoundController } from './notFoundController'

describe('Controller notFoundController()', () => {
  it('should return 404 NOT FOUND', () => {
    const { req, res, next } = makeSut()

    notFoundController(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      code: 404,
      message: 'Page not found'
    }))
  })

  it('should force an internal error if throw query param is set to 1', () => {
    const { req, res, next } = makeSut()
    req.query = { throw: '1' }

    notFoundController(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      code: 500,
      message: 'Something went wrong'
    }))
  })
})
