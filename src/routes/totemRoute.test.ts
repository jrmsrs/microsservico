import request from 'supertest'
import app from '../app'

let generatedTotemId: number

describe('Route totem', () => {
  const totem = {
    localizacao: 'Teste',
    descricao: 'Teste'
  }

  const testTotemProperties = (object: object): void => {
    const array = ['id', 'localizacao', 'descricao']
    array.forEach((property) => {
      expect(object).toHaveProperty(property)
    })
  }

  const expectError = (response: request.Response, code: number, message: string): void => {
    expect(response.status).toBe(code)
    expect(response.body).toEqual({ code, message })
  }

  describe('POST /totem', () => {
    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).post('/totem').send({})
      expectError(response, 422, 'Campos obrigatórios não preenchidos')
    })

    it('should return 201 and the created totem', async () => {
      const response = await request(app).post('/totem').send(totem)
      expect(response.status).toBe(201)
      testTotemProperties(response.body)
      generatedTotemId = response.body.id
    })
  })

  describe('GET /totem', () => {
    it('should return 200 and an array of totem', async () => {
      const response = await request(app).get('/totem')
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBeGreaterThan(0)
      testTotemProperties(response.body[0])
    })
  })

  describe('GET /totem/:id', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).get('/totem/-1')
      expectError(response, 404, 'Totem não encontrado')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).get('/totem/invalid-id')
      expectError(response, 422, 'ID inválido')
    })

    it('should return 200 and a totem', async () => {
      const response = await request(app).get(`/totem/${generatedTotemId}`)
      expect(response.status).toBe(200)
      testTotemProperties(response.body)
    })
  })

  describe('PUT /totem/:id', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).put('/totem/-1').send(totem)
      expectError(response, 404, 'Totem não encontrado')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).put(`/totem/${generatedTotemId}`).send({})
      expectError(response, 422, 'Campos obrigatórios não preenchidos')
    })

    it('should return 200 and the updated totem', async () => {
      const response = await request(app).put(`/totem/${generatedTotemId}`).send({ ...totem, localizacao: 'Alterado' })
      expect(response.status).toBe(200)
      testTotemProperties(response.body)
    })
  })

  describe('GET /totem/:id/trancas', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).get('/totem/-1/trancas')
      expectError(response, 404, 'Totem não encontrado')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).get('/totem/AbCd/trancas')
      expectError(response, 422, 'ID inválido')
    })

    it('should return 200 and an array of trancas', async () => {
      const response = await request(app).get(`/totem/${generatedTotemId}/trancas`)
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
    })
  })

  describe('GET /totem/:id/bicicletas', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).get('/totem/-1/bicicletas')
      expectError(response, 404, 'Totem não encontrado')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).get('/totem/AbCd/bicicletas')
      expectError(response, 422, 'ID inválido')
    })

    it('should return 200 and an array of bicicletas', async () => {
      const response = await request(app).get(`/totem/${generatedTotemId}/bicicletas`)
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
    })
  })

  describe('DELETE /totem/:id', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).delete('/totem/-1')
      expectError(response, 404, 'Totem não encontrado')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).delete('/totem/AbCd')
      expectError(response, 422, 'ID inválido')
    })

    it('should return 200 OK', async () => {
      const response = await request(app).delete(`/totem/${generatedTotemId}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual('')
    })
  })
})
