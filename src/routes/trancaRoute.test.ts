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

const expectError = (response: request.Response, code: number, message: string): void => {
  expect(response.status).toBe(code)
  expect(response.body).toEqual({ code, message })
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
      expectError(response, 422, 'Campos obrigatórios não preenchidos')
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
      expectError(response, 404, 'Tranca não encontrada')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).get('/tranca/invalid-id')
      expectError(response, 422, 'ID inválido')
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
      expectError(response, 404, 'Tranca não encontrada')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).put('/tranca/invalid-id').send(tranca)
      expectError(response, 422, 'ID inválido')
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
      expectError(response, 404, 'Totem não encontrado')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).post('/tranca/integrarNaRede').send({})
      expectError(response, 422, 'Campos obrigatórios não preenchidos')
    })

    it('should return 200 OK', async () => {
      // funcionario pré-cadastrado com meu email
      const funcionarioId = '8cd10c7c-20b3-44fc-9d47-5578726ab506'
      const response = await request(app).post('/tranca/integrarNaRede').send({
        funcionarioId,
        totemId: 21,
        trancaId: generatedTrancaId
      })
      console.log(response)
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        emailGerado: {
          email: 'arlsjunior@edu.unirio.br',
          assunto: expect.any(String),
          mensagem: expect.any(String)
        }
      })
    })
  })

  describe('POST /tranca/:id/trancar', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app)
        .post(`/tranca/${preExistentTrancaId}/trancar`)
        .send({ bicicletaId: -1 })
      expectError(response, 404, 'Bicicleta não encontrada')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app)
        .post('/tranca/invalid-id/trancar')
        .send({ bicicletaId: preExistentBicicletaId })
      expectError(response, 422, 'Algum campo foi preenchido com caracter(es) inválido(s)')
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
      expectError(response, 404, 'Tranca não encontrada')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app)
        .post('/tranca/invalid-id/destrancar')
        .send({ bicicletaId: preExistentBicicletaId })
      expectError(response, 422, 'Algum campo foi preenchido com caracter(es) inválido(s)')
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
      expectError(response, 404, 'Totem não encontrado')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).post('/tranca/retirarDaRede').send({})
      expectError(response, 422, 'Campos obrigatórios não preenchidos')
    })

    it('should return 200 OK', async () => {
      // funcionario pré-cadastrado com meu email
      const funcionarioId = '8cd10c7c-20b3-44fc-9d47-5578726ab506'
      const response = await request(app).post('/tranca/retirarDaRede').send({
        funcionarioId,
        totemId: 21,
        trancaId: generatedTrancaId,
        statusAcaoReparador: 'em reparo'
      })
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        emailGerado: {
          email: 'arlsjunior@edu.unirio.br',
          assunto: expect.any(String),
          mensagem: expect.any(String)
        }
      })
    })
  })

  describe('DELETE /tranca/:id', () => {
    it('should return 404 NOT FOUND', async () => {
      const response = await request(app).delete('/tranca/-1')
      expectError(response, 404, 'Tranca não encontrada')
    })

    it('should return 422 UNPROCESSABLE ENTITY', async () => {
      const response = await request(app).delete('/tranca/invalid-id')
      expectError(response, 422, 'ID inválido')
    })

    it('should return 200 OK', async () => {
      const response = await request(app).delete(`/tranca/${generatedTrancaId}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual('')
    })
  })
})
