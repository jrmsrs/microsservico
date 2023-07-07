import request from 'supertest'
import app from '../app'

describe('Route notfoundRoute', () => {
  describe('GET /invalid-route', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).get('/{*}')
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ code: 404, message: 'Page not found' })
    })
  })

  describe('GET /invalid-route?throw=1', () => {
    it('should return 500 INTERNAL', async () => {
      const response = await request(app).get('/invalid-route?throw=1')
      expect(response.status).toBe(500)
      expect(response.body).toEqual({ code: 500, message: 'Something went wrong' })
    })
  })
})
