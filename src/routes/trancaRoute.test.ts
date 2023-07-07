import request from 'supertest'
import app from '../app'

// pré-condição pra rodar o teste:
// existir uma primeira tranca, existir um primeiro funcionário

const testTrancaProperties = (object: object): void => {
  const array = ['id', 'modelo', 'anoDeFabricacao']
  array.forEach((property) => {
    expect(object).toHaveProperty(property)
  })
}

const preExistentBicicletaId = 16
const preExistentTrancaId = 12

describe('Route tranca', () => {
  let generatedTrancaId: number

  const tranca = {
    modelo: 'Teste',
    anoDeFabricacao: '2021',
    numero: 6
  }

  describe('POST /tranca', () => {
    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).post('/tranca').send({})
      expect(response.status).toBe(422)
      expect(response.body).toEqual({ code: 422, message: 'Campos obrigatórios não preenchidos' })
    })

    it('should return 201 and the created tranca', async () => {
      const response = await request(app).post('/tranca').send(tranca)
      expect(response.status).toBe(201)
      testTrancaProperties(response.body)
      generatedTrancaId = response.body.id
    })
  })

  describe('GET /tranca', () => {
    it('should return 200 and an array of tranca', async () => {
      const response = await request(app).get('/tranca')
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBeGreaterThan(0)
      testTrancaProperties(response.body[0])
    })
  })

  describe('GET /tranca/:id', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).get('/tranca/-1')
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ code: 404, message: 'Tranca não encontrada' })
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).get('/tranca/invalid-id')
      expect(response.status).toBe(422)
      expect(response.body).toEqual({ code: 422, message: 'ID inválido' })
    })

    it('should return 200 and a tranca', async () => {
      const response = await request(app).get(`/tranca/${generatedTrancaId}`)
      expect(response.status).toBe(200)
      testTrancaProperties(response.body)
    })
  })

  describe('PUT /tranca/:id', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).put('/tranca/-1').send(tranca)
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ code: 404, message: 'Tranca não encontrada' })
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).put('/tranca/invalid-id').send(tranca)
      expect(response.status).toBe(422)
      expect(response.body).toEqual({ code: 422, message: 'ID inválido' })
    })

    it('should return 200 and the updated tranca', async () => {
      const response = await request(app).put(`/tranca/${generatedTrancaId}`).send({ ...tranca, modelo: 'Modelo alterado' })
      expect(response.status).toBe(200)
      testTrancaProperties(response.body)
    })
  })

  describe('POST /tranca/integrarNaRede', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).post('/tranca/integrarNaRede').send({
        funcionarioId: 1,
        totemId: -1,
        trancaId: generatedTrancaId
      })
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ code: 404, message: 'Totem não encontrado' })
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).post('/tranca/integrarNaRede').send({})
      expect(response.status).toBe(422)
      expect(response.body).toEqual({ code: 422, message: 'Campos obrigatórios não preenchidos' })
    })

    it('should return 200 OK', async () => { }) // depende de um funcionario existente
  })

  describe('POST /tranca/:id/trancar', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app)
        .post(`/tranca/${preExistentTrancaId}/trancar`)
        .send({ bicicletaId: -1 })
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ code: 404, message: 'Bicicleta não encontrada' })
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app)
        .post('/tranca/invalid-id/trancar')
        .send({ bicicletaId: preExistentBicicletaId })
      expect(response.status).toBe(422)
      expect(response.body).toEqual({ code: 422, message: 'Algum campo foi preenchido com caracter(es) inválido(s)' })
    })

    it('should return 200 OK', async () => {
      const response = await request(app)
        .post(`/tranca/${preExistentTrancaId}/trancar`)
        .send({ bicicletaId: preExistentBicicletaId })
      expect(response.status).toBe(200)
      testTrancaProperties(response.body)
    })
  })

  describe('POST /tranca/:id/destrancar', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app)
        .post('/tranca/-1/destrancar')
        .send({ bicicletaId: preExistentBicicletaId })
      // expect(response.status).toBe(404)
      expect(response.body).toEqual({ code: 404, message: 'Tranca não encontrada' })
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app)
        .post('/tranca/invalid-id/destrancar')
        .send({ bicicletaId: preExistentBicicletaId })
      expect(response.status).toBe(422)
      expect(response.body).toEqual({ code: 422, message: 'Algum campo foi preenchido com caracter(es) inválido(s)' })
    })

    it('should return 200 OK', async () => {
      const response = await request(app)
        .post(`/tranca/${preExistentTrancaId}/destrancar`)
        .send({ bicicletaId: preExistentBicicletaId })
      expect(response.status).toBe(200)
      testTrancaProperties(response.body)
    })
  })

  describe('POST /tranca/retirarDaRede', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).post('/tranca/retirarDaRede').send({
        funcionarioId: 1,
        totemId: -1,
        trancaId: generatedTrancaId,
        statusAcaoReparador: 'em reparo'
      })
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ code: 404, message: 'Totem não encontrado' })
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).post('/tranca/retirarDaRede').send({})
      expect(response.status).toBe(422)
      expect(response.body).toEqual({ code: 422, message: 'Campos obrigatórios não preenchidos' })
    })

    it('should return 200 OK', async () => { }) // depende de um funcionario existente
  })

  describe('DELETE /tranca/:id', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).delete('/tranca/-1')
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ code: 404, message: 'Tranca não encontrada' })
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).delete('/tranca/invalid-id')
      expect(response.status).toBe(422)
      expect(response.body).toEqual({ code: 422, message: 'ID inválido' })
    })

    it('should return 200 OK', async () => {
      const response = await request(app).delete(`/tranca/${generatedTrancaId}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual('')
    })
  })
})
