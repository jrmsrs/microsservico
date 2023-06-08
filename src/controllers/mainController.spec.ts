import { mockRequest, mockResponse } from '../utils/interceptor'
import { mainController } from './mainController'

describe('Controller mainController()', () => {
  test('should return hello world', () => {
    const req = mockRequest() as any
    const res = mockResponse() as any

    mainController(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Hello World!' })
  })
})
