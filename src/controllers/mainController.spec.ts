import { makeSut } from '../utils/interceptor'
import { mainController } from './mainController'

describe('Controller mainController()', () => {
  it('should return a welcome message', () => {
    const { req, res } = makeSut()

    mainController(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'A documentação das endpoints estão em /docs' })
  })
})
