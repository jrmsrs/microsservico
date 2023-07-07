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
      expect(response.status).toBe(422)
      expect(response.body).toEqual({ code: 422, message: 'Campos obrigatórios não preenchidos' })
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
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ code: 404, message: 'Bicicleta não encontrada' })
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).get('/bicicleta/invalid-id')
      expect(response.status).toBe(422)
      expect(response.body).toEqual({ code: 422, message: 'ID inválido' })
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
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ code: 404, message: 'Bicicleta não encontrada' })
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).put('/bicicleta/invalid-id').send(bicicleta)
      expect(response.status).toBe(422)
      expect(response.body).toEqual({ code: 422, message: 'ID inválido' })
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
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ code: 404, message: 'Tranca não encontrada' })
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).post('/bicicleta/integrarNaRede').send({})
      expect(response.status).toBe(422)
      expect(response.body).toEqual({ code: 422, message: 'Campos obrigatórios não preenchidos' })
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
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ code: 404, message: 'Tranca não encontrada' })
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).post('/bicicleta/retirarDaRede').send({})
      expect(response.status).toBe(422)
      expect(response.body).toEqual({ code: 422, message: 'Campos obrigatórios não preenchidos' })
    })
  })

  describe('DELETE /bicicleta/:id', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).delete('/bicicleta/-1')
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ code: 404, message: 'Bicicleta não encontrada' })
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).delete('/bicicleta/invalid-id')
      expect(response.status).toBe(422)
      expect(response.body).toEqual({ code: 422, message: 'ID inválido' })
    })

    it('should return 200 OK', async () => {
      const response = await request(app).delete(`/bicicleta/${generatedBicicletaId}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual('')
    })
  })
})
