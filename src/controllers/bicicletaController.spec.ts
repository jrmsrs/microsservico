import { mockNext, mockRequest, mockResponse } from '../utils/interceptor'
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
    id: 'a2f43e3b-f0f6-40fd-a6a7-dea545076333',
    modelo: 'Modelo 2',
    marca: 'Marca 2',
    ano: '2021',
    numero: 2,
    status: 'disponivel'
  } as any

  const testExistentId = 'a2f43e3b-f0f6-40fd-a6a7-dea545076333'
  const testNonExistentId = 'a2f43e3b-f0f6-40fd-a6a7-dea545070000'
  const testInvalidId = 'not-uuid'
  const testInvalidAno = 'not-a-number'

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

  describe('Controller getBicicleta', () => {
    it('should return 200 OK and a list of bicicletas', () => {
      const { req, res, next } = makeSut()
      getBicicleta(req, res, next)
      expectResCalledArrayContaning(
        res, 200, testExistentBody
      )
    })
  })

  describe('Controller getBicicletaById', () => {
    it('should return 200 OK and a bicicleta', () => {
      const { req, res, next } = makeSut(testExistentId)
      getBicicletaById(req, res, next)
      expectResCalledBody(
        res, 200, testExistentBody
      )
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const { req, res, next } = makeSut(testInvalidId)
      getBicicletaById(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const { req, res, next } = makeSut(null)
      getBicicletaById(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any bicicleta', () => {
      const { req, res, next } = makeSut(testNonExistentId)
      getBicicletaById(req, res, next)
      expectNextCalledWith(
        res, next, 404,
        'Bicicleta não encontrada'
      )
    })
  })

  describe('Controller createBicicleta', () => {
    it('should return 201 CREATED and created the bicicleta', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(null, body)
      createBicicleta(req, res, next)
      expectResCalledBody(
        res, 201, {
          ...req.body,
          id: expect.any(String)
        })
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testBody }
      delete body.modelo
      const { req, res, next } = makeSut(null, body)
      createBicicleta(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'Campos obrigatórios não preenchidos'
      )
    })

    it('should return 400 BAD REQUEST if a field is not valid', () => {
      const body = { ...testBody }
      body.ano = testInvalidAno
      const { req, res, next } = makeSut(null, body)
      createBicicleta(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'Algum campo foi preenchido com caracter(es) inválido(s)'
      )
    })
  })

  describe('Controller updateBicicleta', () => {
    it('should return 200 OK and the updated bicicleta', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testExistentId, body)
      updateBicicleta(req, res, next)
      expectResCalledBody(
        res, 200, {
          ...req.body, id: testExistentId
        }
      )
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testInvalidId, body)
      updateBicicleta(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 400 BAD REQUEST if a field is not valid', () => {
      const body = { ...testBody }
      body.ano = testInvalidAno
      const { req, res, next } = makeSut(testExistentId, body)
      updateBicicleta(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'Algum campo foi preenchido com caracter(es) inválido(s)'
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(null, body)
      updateBicicleta(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any bicicleta', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testNonExistentId, body)
      updateBicicleta(req, res, next)
      expectNextCalledWith(
        res, next, 404,
        'Bicicleta não encontrada'
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testBody }
      delete body.modelo
      const { req, res, next } = makeSut(testExistentId, body)
      updateBicicleta(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'Campos obrigatórios não preenchidos'
      )
    })
  })

  describe('Controller deleteBicicleta', () => {
    it('should return 200 OK', () => {
      const { req, res, next } = makeSut(testExistentId)
      deleteBicicleta(req, res, next)
      expectResCalledBody(res)
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const { req, res, next } = makeSut(testInvalidId)
      deleteBicicleta(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const { req, res, next } = makeSut(null)
      deleteBicicleta(req, res, next)
      expectNextCalledWith(
        res, next, 400,
        'ID inválido'
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any bicicleta', () => {
      const { req, res, next } = makeSut(testNonExistentId)
      deleteBicicleta(req, res, next)
      expectNextCalledWith(
        res, next, 404,
        'Bicicleta não encontrada'
      )
    })
  })
})
