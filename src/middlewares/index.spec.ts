import Middlewares from './index'

describe('Middlewares', () => {
  it('should ensure that all middlewares are called', () => {
    expect(Middlewares({ use: jest.fn() } as any)).toBeUndefined() // void
  })
})
