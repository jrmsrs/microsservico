import request from 'supertest'
import app from '../app'

describe('Route index', () => {
  describe('GET /', () => {
    it('should return 303 and redirect to /docs', async () => {
      const response = await request(app).get('/')
      expect(response.statusCode).toBe(303)
      expect(response.get('Location')).toBe('/docs')
    })
  })
})
