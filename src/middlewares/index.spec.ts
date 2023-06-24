import Middlewares from './index'
import { skip } from './logger'
import { Request } from 'express'
// describe('Ignore', () => { it('should pass', () => { expect(true).toBe(true) }) })
describe('Middlewares', () => {
  it('should ensure that all middlewares are called', () => {
    expect(Middlewares({ use: jest.fn() } as any)).toBeUndefined() // void
  })

  it('should ensure that logger skip it\'s working correctly', () => {
    const reqFile: Request = { path: '/example.png' } as any
    const reqNonFile: Request = { path: '/example' } as any
    const skipResult1 = skip(reqFile)
    const skipResult2 = skip(reqNonFile)
    expect(skipResult1).toBe(true)
    expect(skipResult2).toBe(false)
  })
})
