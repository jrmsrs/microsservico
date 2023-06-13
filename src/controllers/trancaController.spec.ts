import { mockNext, mockRequest, mockResponse } from '../utils/interceptor'
import { getTranca, getTrancaById, createTranca, updateTranca, deleteTranca } from './trancaController'

describe('Controller trancaController', () => {
  const testBody = {
    totemId: '40dd16cd-c6de-4836-bb0f-cda7a8e24bf6',
    numero: 2,
    anoDeFabricacao: '2020',
    modelo: 'Modelo Teste',
    status: 'disponivel'
  } as any

  const testExistentBody = {
    id: '6100f40d-5d5d-4178-85ba-4c8cc6be002b',
    totemId: '40dd16cd-c6de-4836-bb0f-cda7a8e24bf6',
    numero: 3,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 3',
    status: 'disponivel',
    localizacao: 'Localização 1'
  } as any

  const testExistentId = '6100f40d-5d5d-4178-85ba-4c8cc6be002b'
  const testNonExistentId = 'a2f43e3b-f0f6-40fd-a6a7-dea545070000'
  const testInvalidId = 'not-uuid'
  const testInvalidAno = 'not-a-number'
  const testInvalidTokenId = '99dd16cd-c6de-4836-bb0f-cda7a8e24b99'

  const expectResCalledBody = (res: any, status: any = 200, body?: any): void => {
    expect(res.status).toHaveBeenCalledWith(status)
    if (body !== undefined) {
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(body))
    } else {
      expect(res.json).toHaveBeenCalled()
    }
  }

  const expectResCalledArrayContaning = (res: any, status: any = 200, body?: any): void => {
    expect(res.status).toHaveBeenCalledWith(status)
    if (body !== undefined) {
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([body]))
    } else {
      expect(res.json).toHaveBeenCalled()
    }
  }

  const expectNextCalledWith = (res: any, next: any, code: any = 200, message?: any): void => {
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code,
        message
      })
    )
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  }

  const makeSut = (id?: any, body?: any): { req: any, res: any, next: any } => {
    const req = mockRequest() as any
    req.params.id = id
    req.body = body
    const res = mockResponse() as any
    const next = mockNext as any
    return { req, res, next }
  }

  describe('Controller getTranca', () => {
    it('should return 200 OK and a list of trancas', () => {
      const { req, res, next } = makeSut()
      getTranca(req, res, next)
      expectResCalledArrayContaning(
        res, 200, testExistentBody
      )
    })
  })

  describe('Controller getTrancaById', () => {
    it('should return 200 OK and a tranca', () => {
      const { req, res, next } = makeSut(testExistentId)
      getTrancaById(req, res, next)
      expectResCalledBody(
        res, 200, testExistentBody
      )
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const { req, res, next } = makeSut(testInvalidId)
      getTrancaById(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const { req, res, next } = makeSut(null)
      getTrancaById(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any tranca', () => {
      const { req, res, next } = makeSut(testNonExistentId)
      getTrancaById(req, res, next)
      expectNextCalledWith(
        res, next, 404,
        'Tranca não encontrada'
      )
    })
  })

  describe('Controller createTranca', () => {
    it('should return 201 CREATED and created the tranca', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(null, body)
      createTranca(req, res, next)
      expectResCalledBody(
        res, 201, {
          ...req.body,
          id: expect.any(String),
          localizacao: 'Localização 1'
        })
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testBody }
      delete body.modelo
      const { req, res, next } = makeSut(null, body)
      createTranca(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'Campos obrigatórios não preenchidos'
      )
    })

    it('should return 400 BAD REQUEST if a field is not valid', () => {
      const body = { ...testBody }
      body.anoDeFabricacao = testInvalidAno
      const { req, res, next } = makeSut(null, body)
      createTranca(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'Algum campo foi preenchido com caracter(es) inválido(s)'
      )
    })

    it('should return 400 BAD REQUEST if a foreignkey is invalid', () => {
      const body = { ...testBody }
      body.totemId = testInvalidTokenId
      const { req, res, next } = makeSut(null, body)
      createTranca(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'TotemID inválido / não encontrado'
      )
    })
  })

  describe('Controller updateTranca', () => {
    it('should return 200 OK and the updated tranca', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testExistentId, body)
      updateTranca(req, res, next)
      expectResCalledBody(
        res, 200, {
          ...req.body, id: testExistentId
        }
      )
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testInvalidId, body)
      updateTranca(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 400 BAD REQUEST if a field is not valid', () => {
      const body = { ...testBody }
      body.anoDeFabricacao = testInvalidAno
      const { req, res, next } = makeSut(testExistentId, body)
      updateTranca(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'Algum campo foi preenchido com caracter(es) inválido(s)'
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(null, body)
      updateTranca(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any tranca', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testNonExistentId, body)
      updateTranca(req, res, next)
      expectNextCalledWith(
        res, next, 404,
        'Tranca não encontrada'
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testBody }
      delete body.modelo
      const { req, res, next } = makeSut(testExistentId, body)
      updateTranca(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'Campos obrigatórios não preenchidos'
      )
    })

    it('should return 400 BAD REQUEST if a foreignkey is invalid', () => {
      const body = { ...testBody }
      body.totemId = testInvalidTokenId
      const { req, res, next } = makeSut(testExistentId, body)
      updateTranca(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'TotemID inválido / não encontrado'
      )
    })
  })

  describe('Controller deleteTranca', () => {
    it('should return 200 OK', () => {
      const { req, res, next } = makeSut(testExistentId)
      deleteTranca(req, res, next)
      expectResCalledBody(res)
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const { req, res, next } = makeSut(testInvalidId)
      deleteTranca(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const { req, res, next } = makeSut(null)
      deleteTranca(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any tranca', () => {
      const { req, res, next } = makeSut(testNonExistentId)
      deleteTranca(req, res, next)
      expectNextCalledWith(
        res, next, 404,
        'Tranca não encontrada'
      )
    })
  })
})
