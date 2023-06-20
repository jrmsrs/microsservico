import { makeSut } from '../utils/interceptor'
import { getTranca, getTrancaById, createTranca, updateTranca, deleteTranca } from './trancaController'
import { status } from '../enums/statusTrancaEnum'

describe('Controller trancaController', () => {
  const testBody = {
    totemId: 3,
    numero: 2,
    anoDeFabricacao: '2020',
    modelo: 'Modelo Teste',
    status: status.DISPONIVEL
  } as any

  const testExistentBody = {
    id: 6,
    totemId: 3,
    numero: 6,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 6',
    status: status.DISPONIVEL,
    localizacao: 'Localização 3'
  } as any

  const errorBody = {
    invalidId: {
      code: 400, message: 'ID inválido'
    },
    invalidFK: {
      code: 400, message: 'TotemID inválido / não encontrado'
    },
    mandatoryNotFilled: {
      code: 400, message: 'Campos obrigatórios não preenchidos'
    },
    invalidField: {
      code: 400, message: 'Algum campo foi preenchido com caracter(es) inválido(s)'
    },
    notFound: {
      code: 404, message: 'Tranca não encontrada'
    }
  }

  const testExistentId = 6
  const testNonExistentId = -1
  const testInvalidNumber = 'not-a-number'
  const testInvalidTokenId = -1

  const expectResCalledWith = (successStatus: any, res: any, expectStatus: any, expectRes?: any): void => {
    if (successStatus !== null) {
      expect(successStatus).toHaveBeenCalledWith(expectStatus)
    }
    if (expectRes !== undefined) {
      expect(res).toHaveBeenCalledWith(expectRes)
    } else {
      expect(res).toHaveBeenCalled()
    }
  }

  describe('Controller getTranca', () => {
    it('should return 200 OK and a list of trancas', () => {
      const { req, res, next } = makeSut()
      getTranca(req, res, next)
      expectResCalledWith(
        res.status, res.json,
        200, expect.arrayContaining([testExistentBody])
      )
    })
  })

  describe('Controller getTrancaById', () => {
    it('should return 200 OK and a tranca', () => {
      const { req, res, next } = makeSut(testExistentId)
      getTrancaById(req, res, next)
      expectResCalledWith(
        res.status, res.json,
        200, expect.objectContaining(testExistentBody)
      )
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const { req, res, next } = makeSut(testInvalidNumber)
      getTrancaById(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const { req, res, next } = makeSut()
      getTrancaById(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any tranca', () => {
      const { req, res, next } = makeSut(testNonExistentId)
      getTrancaById(req, res, next)
      expectResCalledWith(
        null, next,
        404, expect.objectContaining(errorBody.notFound)
      )
    })
  })

  describe('Controller createTranca', () => {
    it('should return 201 CREATED and created the tranca', () => {
      const body = { ...testBody }
      delete body.totemId
      const { req, res, next } = makeSut(undefined, body)
      createTranca(req, res, next)
      expectResCalledWith(
        res.status, res.json, 201, expect.objectContaining({
          ...req.body,
          id: expect.any(Number),
          localizacao: 'Não instalada',
          status: status.NOVA
        })
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testBody }
      delete body.modelo
      const { req, res, next } = makeSut(undefined, body)
      createTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.mandatoryNotFilled)
      )
    })

    it('should return 400 BAD REQUEST if a field is not valid', () => {
      const body = { ...testBody }
      body.anoDeFabricacao = testInvalidNumber
      const { req, res, next } = makeSut(undefined, body)
      createTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidField)
      )
    })
  })

  describe('Controller updateTranca', () => {
    it('should return 200 OK and the updated tranca', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testExistentId, body)
      updateTranca(req, res, next)
      expectResCalledWith(
        res.status, res.json, 200, expect.objectContaining({
          ...req.body, id: testExistentId
        })
      )
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testInvalidNumber, body)
      updateTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 400 BAD REQUEST if a field is not valid', () => {
      const body = { ...testBody }
      body.anoDeFabricacao = testInvalidNumber
      const { req, res, next } = makeSut(testExistentId, body)
      updateTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidField)
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(undefined, body)
      updateTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any tranca', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testNonExistentId, body)
      updateTranca(req, res, next)
      expectResCalledWith(
        null, next,
        404, expect.objectContaining(errorBody.notFound)
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testBody }
      delete body.modelo
      const { req, res, next } = makeSut(testExistentId, body)
      updateTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.mandatoryNotFilled)
      )
    })

    it('should return 400 BAD REQUEST if a foreignkey is invalid', () => {
      const body = { ...testBody }
      body.totemId = testInvalidTokenId
      const { req, res, next } = makeSut(testExistentId, body)
      updateTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidFK)
      )
    })
  })

  describe('Controller deleteTranca', () => {
    it('should return 200 OK', () => {
      const { req, res, next } = makeSut(testExistentId)
      deleteTranca(req, res, next)
      expectResCalledWith(res.status, res.json, 200)
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const { req, res, next } = makeSut(testInvalidNumber)
      deleteTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const { req, res, next } = makeSut()
      deleteTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any tranca', () => {
      const { req, res, next } = makeSut(testNonExistentId)
      deleteTranca(req, res, next)
      expectResCalledWith(
        null, next,
        404, expect.objectContaining(errorBody.notFound)
      )
    })
  })
})
