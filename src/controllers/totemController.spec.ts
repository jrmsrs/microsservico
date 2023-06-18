import { makeSut } from '../utils/interceptor'
import { getTotem, getTotemById, createTotem, updateTotem, deleteTotem } from './totemController'

describe('Controller totemController', () => {
  const testBody = {
    localizacao: 'Localização Teste',
    descricao: 'Descrição Teste'
  } as any

  const testExistentBody = {
    id: 3,
    localizacao: 'Localização 3',
    descricao: 'Descrição 3'
  } as any

  const errorBody = {
    invalidId: {
      code: 400, message: 'ID inválido'
    },
    mandatoryNotFilled: {
      code: 400, message: 'Campos obrigatórios não preenchidos'
    },
    notFound: {
      code: 404, message: 'Totem não encontrado'
    }
  }

  const testExistentId = 3
  const testNonExistentId = -1
  const testInvalidNumber = 'not-a-number'

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

  describe('Controller getTotem', () => {
    it('should return 200 OK and a list of totens', () => {
      const { req, res, next } = makeSut()
      getTotem(req, res, next)
      expectResCalledWith(
        res.status, res.json,
        200, expect.arrayContaining([testExistentBody])
      )
    })
  })

  describe('Controller getTotemById', () => {
    it('should return 200 OK and a totem', () => {
      const { req, res, next } = makeSut(testExistentId)
      getTotemById(req, res, next)
      expectResCalledWith(
        res.status, res.json,
        200, expect.objectContaining(testExistentBody)
      )
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const { req, res, next } = makeSut(testInvalidNumber)
      getTotemById(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const { req, res, next } = makeSut()
      getTotemById(req, res, next)
      expectResCalledWith(
        null, next, 400,
        expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any totem', () => {
      const { req, res, next } = makeSut(testNonExistentId)
      getTotemById(req, res, next)
      expectResCalledWith(
        null, next, 404,
        expect.objectContaining(errorBody.notFound)
      )
    })
  })

  describe('Controller createTotem', () => {
    it('should return 201 CREATED and created the totem', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(undefined, body)
      createTotem(req, res, next)
      expectResCalledWith(
        res.status, res.json,
        201, expect.objectContaining({
          ...req.body,
          id: expect.any(Number)
        })
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testBody }
      delete body.localizacao
      const { req, res, next } = makeSut(undefined, body)
      createTotem(req, res, next)
      expectResCalledWith(
        null, next, 400,
        expect.objectContaining(errorBody.mandatoryNotFilled)
      )
    })
  })

  describe('Controller updateTotem', () => {
    it('should return 200 OK and the updated totem', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testExistentId, body)
      updateTotem(req, res, next)
      expectResCalledWith(
        res.status, res.json,
        200, expect.objectContaining({
          ...req.body, id: testExistentId
        })
      )
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testInvalidNumber, body)
      updateTotem(req, res, next)
      expectResCalledWith(
        null, next, 400,
        expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(undefined, body)
      updateTotem(req, res, next)
      expectResCalledWith(
        null, next, 400,
        expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any totem', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testNonExistentId, body)
      updateTotem(req, res, next)
      expectResCalledWith(
        null, next, 404,
        expect.objectContaining(errorBody.notFound)
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testBody }
      delete body.localizacao
      const { req, res, next } = makeSut(testExistentId, body)
      updateTotem(req, res, next)
      expectResCalledWith(
        null, next, 400,
        expect.objectContaining(errorBody.mandatoryNotFilled)
      )
    })
  })

  describe('Controller deleteTotem', () => {
    it('should return 200 OK', () => {
      const { req, res, next } = makeSut(testExistentId)
      deleteTotem(req, res, next)
      expectResCalledWith(res.status, res.json, 200)
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const { req, res, next } = makeSut(testInvalidNumber)
      deleteTotem(req, res, next)
      expectResCalledWith(
        null, next, 400,
        expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const { req, res, next } = makeSut()
      deleteTotem(req, res, next)
      expectResCalledWith(
        null, next, 400,
        expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any totem', () => {
      const { req, res, next } = makeSut(testNonExistentId)
      deleteTotem(req, res, next)
      expectResCalledWith(
        null, next, 404,
        expect.objectContaining(errorBody.notFound)
      )
    })
  })
})
