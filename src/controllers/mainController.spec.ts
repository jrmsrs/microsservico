import { Request } from 'express'
import * as MainController from './mainController'

describe('mainController', () => {
  it('should return a 404 error', async () => {
    const mockRequest: Request = {} as any as Request
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      redirect: jest.fn()
    } as any
    await (MainController.mainController(mockRequest, mockResponse) as unknown as Promise<void>)
    expect(mockResponse.status).toBeCalledTimes(0)
    expect(mockResponse.json).toBeCalledTimes(0)
    expect(mockResponse.redirect).toBeCalledWith(303, '/docs')
  })
})
