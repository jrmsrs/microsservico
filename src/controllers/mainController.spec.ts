import { makeSut } from '../utils/interceptor'
import { mainController } from './mainController'

describe('Controller mainController()', () => {
  it('should return a welcome message', () => {
    const { req, res } = makeSut()

    mainController(req, res)

    expect(res.redirect).toHaveBeenCalledWith(303, '/docs')
  })
})
