import { makeSut } from '../utils/interceptor'
import { getBicicleta, getBicicletaById, createBicicleta, updateBicicleta, deleteBicicleta } from './bicicletaController'

describe('Controller bicicletaController', () => {
  const testBody = {
    modelo: 'Modelo Teste',
    marca: 'Marca Teste',
    ano: '2021',
    numero: 4,
    status: 'disponivel'
  } as any

  const testExistentBody = {
    id: 2,
    modelo: 'Modelo 2',
    marca: 'Marca 2',
    ano: '2021',
    numero: 2,
    status: 'disponivel'
  } as any

  const errorBody = {
    invalidId: {
      code: 400, message: 'ID inválido'
    },
    mandatoryNotFilled: {
      code: 400, message: 'Campos obrigatórios não preenchidos'
    },
    invalidField: {
      code: 400, message: 'Algum campo foi preenchido com caracter(es) inválido(s)'
    },
    notFound: {
      code: 404, message: 'Bicicleta não encontrada'
    }
  }

  const testExistentId = 2
  const testNonExistentId = -1
  const testInvalidNumber = 'not-a-number'

  const expectResCalledWith = (successStatus: any, res: any, expectStatus: any = 200, expectRes?: any): void => {
    if (successStatus !== null) {
      expect(successStatus).toHaveBeenCalledWith(expectStatus)
    }
    if (expectRes !== undefined) {
      expect(res).toHaveBeenCalledWith(expectRes)
    } else {
      expect(res).toHaveBeenCalled()
    }
  }

  describe('Controller getBicicleta', () => {
    it('should return 200 OK and a list of bicicletas', () => {
      const { req, res, next } = makeSut()
      getBicicleta(req, res, next)
      expectResCalledWith(
        res.status, res.json,
        200, expect.arrayContaining([testExistentBody])
      )
    })
  })

  describe('Controller getBicicletaById', () => {
    it('should return 200 OK and a bicicleta', () => {
      const { req, res, next } = makeSut(testExistentId)
      getBicicletaById(req, res, next)
      expectResCalledWith(
        res.status, res.json,
        200, expect.objectContaining(testExistentBody)
      )
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const { req, res, next } = makeSut(testInvalidNumber)
      getBicicletaById(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const { req, res, next } = makeSut(null)
      getBicicletaById(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any bicicleta', () => {
      const { req, res, next } = makeSut(testNonExistentId)
      getBicicletaById(req, res, next)
      expectResCalledWith(
        null, next,
        404, expect.objectContaining(errorBody.notFound)
      )
    })
  })

  describe('Controller createBicicleta', () => {
    it('should return 201 CREATED and created the bicicleta', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(null, body)
      createBicicleta(req, res, next)
      expectResCalledWith(
        res.status, res.json, 201, expect.objectContaining({
          ...req.body,
          id: expect.any(Number)
        })
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testBody }
      delete body.modelo
      const { req, res, next } = makeSut(null, body)
      createBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.mandatoryNotFilled)
      )
    })

    it('should return 400 BAD REQUEST if a field is not valid', () => {
      const body = { ...testBody }
      body.ano = testInvalidNumber
      const { req, res, next } = makeSut(null, body)
      createBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidField)
      )
    })
  })

  describe('Controller updateBicicleta', () => {
    it('should return 200 OK and the updated bicicleta', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testExistentId, body)
      updateBicicleta(req, res, next)
      expectResCalledWith(
        res.status, res.json, 200, expect.objectContaining({
          ...req.body, id: testExistentId
        })
      )
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testInvalidNumber, body)
      updateBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 400 BAD REQUEST if a field is not valid', () => {
      const body = { ...testBody }
      body.ano = testInvalidNumber
      const { req, res, next } = makeSut(testExistentId, body)
      updateBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidField)
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(null, body)
      updateBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any bicicleta', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testNonExistentId, body)
      updateBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        404, expect.objectContaining(errorBody.notFound)
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testBody }
      delete body.modelo
      const { req, res, next } = makeSut(testExistentId, body)
      updateBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.mandatoryNotFilled)
      )
    })
  })

  describe('Controller deleteBicicleta', () => {
    it('should return 200 OK', () => {
      const { req, res, next } = makeSut(testExistentId)
      deleteBicicleta(req, res, next)
      expectResCalledWith(res.status, res.json, 200)
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const { req, res, next } = makeSut(testInvalidNumber)
      deleteBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const { req, res, next } = makeSut(null)
      deleteBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any bicicleta', () => {
      const { req, res, next } = makeSut(testNonExistentId)
      deleteBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        404, expect.objectContaining(errorBody.notFound)
      )
    })
  })
})
