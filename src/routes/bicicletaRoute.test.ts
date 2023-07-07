import request from 'supertest'
import app from '../app'

let generatedBicicletaId: number
let funcionarioId: string

const testBicicletaProperties = (object: object): void => {
  const array = ['id', 'modelo', 'marca']
  array.forEach((property) => {
    expect(object).toHaveProperty(property)
  })
}

const expectError = (response: request.Response, code: number, message: string): void => {
  expect(response.status).toBe(code)
  expect(response.body).toEqual({ code, message })
}

describe('Route bicicleta', () => {
  const bicicleta = {
    modelo: 'Teste',
    marca: 'Teste',
    ano: '2021',
    numero: 6
  }

  describe('POST /bicicleta', () => {
    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).post('/bicicleta').send({})
      expectError(response, 422, 'Campos obrigatórios não preenchidos')
    })

    it('should return 201 and the created bicicleta', async () => {
      const response = await request(app).post('/bicicleta').send(bicicleta)
      expect(response.status).toBe(201)
      testBicicletaProperties(response.body)
      generatedBicicletaId = response.body.id
    })
  })

  describe('GET /bicicleta', () => {
    it('should return 200 and an array of bicicleta', async () => {
      const response = await request(app).get('/bicicleta')
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBeGreaterThan(0)
      testBicicletaProperties(response.body[0])
    })
  })

  describe('GET /bicicleta/:id', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).get('/bicicleta/-1')
      expectError(response, 404, 'Bicicleta não encontrada')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).get('/bicicleta/invalid-id')
      expectError(response, 422, 'ID inválido')
    })

    it('should return 200 and a bicicleta', async () => {
      const response = await request(app).get(`/bicicleta/${generatedBicicletaId}`)
      expect(response.status).toBe(200)
      testBicicletaProperties(response.body)
    })
  })

  describe('PUT /bicicleta/:id', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).put('/bicicleta/-1').send(bicicleta)
      expectError(response, 404, 'Bicicleta não encontrada')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).put('/bicicleta/invalid-id').send(bicicleta)
      expectError(response, 422, 'ID inválido')
    })

    it('should return 200 and the updated bicicleta', async () => {
      const response = await request(app).put(`/bicicleta/${generatedBicicletaId}`).send({ ...bicicleta, modelo: 'Modelo alterado' })
      expect(response.status).toBe(200)
      testBicicletaProperties(response.body)
    })
  })

  describe('POST /bicicleta/integrarNaRede', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).post('/bicicleta/integrarNaRede').send({
        funcionarioId,
        trancaId: -1,
        bicicletaId: generatedBicicletaId
      })
      expectError(response, 404, 'Tranca não encontrada')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).post('/bicicleta/integrarNaRede').send({})
      expectError(response, 422, 'Campos obrigatórios não preenchidos')
    })
  })

  describe('POST /bicicleta/retirarDaRede', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).post('/bicicleta/retirarDaRede').send({
        funcionarioId,
        trancaId: -1,
        bicicletaId: generatedBicicletaId,
        statusAcaoReparador: 'em reparo'
      })
      expectError(response, 404, 'Tranca não encontrada')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).post('/bicicleta/retirarDaRede').send({})
      expectError(response, 422, 'Campos obrigatórios não preenchidos')
    })
  })

  describe('DELETE /bicicleta/:id', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).delete('/bicicleta/-1')
      expectError(response, 404, 'Bicicleta não encontrada')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).delete('/bicicleta/invalid-id')
      expectError(response, 422, 'ID inválido')
    })

    it('should return 200 OK', async () => {
      const response = await request(app).delete(`/bicicleta/${generatedBicicletaId}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual('')
    })
  })
})
