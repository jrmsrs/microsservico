import { mockNext, mockRequest, mockResponse } from '../utils/interceptor'
import { getTotem, getTotemById, createTotem, updateTotem, deleteTotem } from './totemController'

describe('Controller totemController', () => {
  const testBody = {
    localizacao: 'Localização Teste',
    descricao: 'Descrição Teste'
  } as any

  const testExistentBody = {
    id: '859f074e-e02e-427d-be61-8d87129c1bbd',
    localizacao: 'Localização 3',
    descricao: 'Descrição 3'
  } as any

  const testExistentId = '859f074e-e02e-427d-be61-8d87129c1bbd'
  const testNonExistentId = 'a2f43e3b-f0f6-40fd-a6a7-dea545070000'
  const testInvalidId = 'not-uuid'

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

  describe('Controller getTotem', () => {
    it('should return 200 OK and a list of totens', () => {
      const { req, res, next } = makeSut()
      getTotem(req, res, next)
      expectResCalledArrayContaning(
        res, 200, testExistentBody
      )
    })
  })

  describe('Controller getTotemById', () => {
    it('should return 200 OK and a totem', () => {
      const { req, res, next } = makeSut(testExistentId)
      getTotemById(req, res, next)
      expectResCalledBody(
        res, 200, testExistentBody
      )
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const { req, res, next } = makeSut(testInvalidId)
      getTotemById(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const { req, res, next } = makeSut(null)
      getTotemById(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any totem', () => {
      const { req, res, next } = makeSut(testNonExistentId)
      getTotemById(req, res, next)
      expectNextCalledWith(
        res, next, 404,
        'Totem não encontrado'
      )
    })
  })

  describe('Controller createTotem', () => {
    it('should return 201 CREATED and created the totem', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(null, body)
      createTotem(req, res, next)
      expectResCalledBody(
        res, 201, {
          ...req.body,
          id: expect.any(String)
        })
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testBody }
      delete body.localizacao
      const { req, res, next } = makeSut(null, body)
      createTotem(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'Campos obrigatórios não preenchidos'
      )
    })
  })

  describe('Controller updateTotem', () => {
    it('should return 200 OK and the updated totem', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testExistentId, body)
      updateTotem(req, res, next)
      expectResCalledBody(
        res, 200, {
          ...req.body, id: testExistentId
        }
      )
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testInvalidId, body)
      updateTotem(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(null, body)
      updateTotem(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any totem', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testNonExistentId, body)
      updateTotem(req, res, next)
      expectNextCalledWith(
        res, next, 404,
        'Totem não encontrado'
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testBody }
      delete body.localizacao
      const { req, res, next } = makeSut(testExistentId, body)
      updateTotem(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'Campos obrigatórios não preenchidos'
      )
    })
  })

  describe('Controller deleteTotem', () => {
    it('should return 200 OK', () => {
      const { req, res, next } = makeSut(testExistentId)
      deleteTotem(req, res, next)
      expectResCalledBody(res)
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const { req, res, next } = makeSut(testInvalidId)
      deleteTotem(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const { req, res, next } = makeSut(null)
      deleteTotem(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any totem', () => {
      const { req, res, next } = makeSut(testNonExistentId)
      deleteTotem(req, res, next)
      expectNextCalledWith(
        res, next, 404,
        'Totem não encontrado'
      )
    })
  })
})
