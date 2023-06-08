import { mockNext, mockRequest, mockResponse } from '../utils/interceptor'
import {
  getBicicleta,
  getBicicletaById,
  createBicicleta,
  updateBicicleta,
  deleteBicicleta
} from './bicicletaController'

describe('Controller getBicicleta', () => {
  test('should return status 200 and a list of bicicletas', () => {
    const req = mockRequest()
    const res = mockResponse()
    const next = mockNext

    getBicicleta(req as any, res as any, next)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.any(Array))
  })
})

describe('Controller getBicicletaById', () => {
  test('should return status 200 and a bicicleta', () => {
    const req = mockRequest() as any
    req.params.id = 'a2f43e3b-f0f6-40fd-a6a7-dea545076333'
    const res = mockResponse() as any
    const next = mockNext as any

    getBicicletaById(req, res, next)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ id: 'a2f43e3b-f0f6-40fd-a6a7-dea545076333', modelo: 'Modelo 2', marca: 'Marca 2', ano: '2021', numero: 2, status: 'disponivel' })
  })

  test('should return status 400 bad request if id doesn\'t match UUID format', () => {
    const req = mockRequest() as any
    req.params.id = 'non-uuid'
    const res = mockResponse() as any
    const next = mockNext as any

    getBicicletaById(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
        message: 'ID inválido'
      })
    )
    expect(res.status).not.toHaveBeenCalled() // No need to check status when next is called
    expect(res.json).not.toHaveBeenCalled() // No need to check json when next is called
  })

  test('should return status 400 bad request if id is not provided', () => {
    const req = mockRequest() as any
    req.params.id = null
    const res = mockResponse() as any
    const next = mockNext as any

    getBicicletaById(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
        message: 'ID inválido'
      })
    )
    expect(res.status).not.toHaveBeenCalled() // No need to check status when next is called
    expect(res.json).not.toHaveBeenCalled() // No need to check json when next is called
  })

  test('should return status 404 not found if uuid is valid but doesn\'t match any bicicleta', () => {
    const req = mockRequest() as any
    // comparing to 'a2f43e3b-f0f6-40fd-a6a7-dea545076333'
    req.params.id = 'a2f43e3b-f0f6-40fd-a6a7-dea545076334'
    const res = mockResponse() as any
    const next = mockNext as any

    getBicicletaById(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 404,
        message: 'Bicicleta não encontrada'
      })
    )
    expect(res.status).not.toHaveBeenCalled() // No need to check status when next is called
    expect(res.json).not.toHaveBeenCalled() // No need to check json when next is called
  })
})

describe('Controller createBicicleta', () => {
  test('should return status 201 and the created bicicleta', () => {
    const req = mockRequest() as any
    req.body = { modelo: 'Modelo 4', marca: 'Marca 4', ano: '2021', numero: 4, status: 'disponivel' }
    const res = mockResponse() as any
    const next = mockNext as any

    createBicicleta(req, res, next)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String), modelo: 'Modelo 4', marca: 'Marca 4', ano: '2021', numero: 4, status: 'disponivel' }))
  })

  test('should return status 400 bad request if a a mandatory field is not provided', () => {
    const req = mockRequest() as any
    req.body = { modelo: 'Modelo 4', marca: 'Marca 4', ano: '2021' }
    const res = mockResponse() as any
    const next = mockNext as any

    createBicicleta(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
        message: 'Campos obrigatórios não preenchidos'
      })
    )
    expect(res.status).not.toHaveBeenCalled() // No need to check status when next is called
    expect(res.json).not.toHaveBeenCalled() // No need to check json when next is called
  })

  test('should return status 400 bad request if a field is not valid', () => {
    const req = mockRequest() as any
    req.body = { modelo: 'Modelo 4', marca: 'Marca 4', ano: 'abc', numero: 4 }
    const res = mockResponse() as any
    const next = mockNext as any

    createBicicleta(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
        message: 'Algum campo foi preenchido com caracter(es) inválido(s)'
      })
    )
    expect(res.status).not.toHaveBeenCalled() // No need to check status when next is called
    expect(res.json).not.toHaveBeenCalled() // No need to check json when next is called
  })

  test('should return status 400 bad request if id doesn\'t match UUID format', () => {
    const req = mockRequest() as any
    req.body = { id: 'non-uuid', modelo: 'Modelo 4', marca: 'Marca 4', ano: '2021', numero: 4 }
    const res = mockResponse() as any
    const next = mockNext as any

    createBicicleta(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
        message: 'ID inválido'
      })
    )
  })
})

describe('Controller updateBicicleta', () => {
  test('should return status 200 and the updated bicicleta', () => {
    const req = mockRequest() as any
    req.params.id = 'a2f43e3b-f0f6-40fd-a6a7-dea545076333'
    req.body = { modelo: 'Modelo 4', marca: 'Marca 4', ano: '2021', numero: 4, status: 'disponivel' }
    const res = mockResponse() as any
    const next = mockNext as any

    updateBicicleta(req, res, next)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'a2f43e3b-f0f6-40fd-a6a7-dea545076333', modelo: 'Modelo 4', marca: 'Marca 4', ano: '2021', numero: 4, status: 'disponivel' }))
  })

  test('should return status 400 bad request if id doesn\'t match UUID format', () => {
    const req = mockRequest() as any
    req.params.id = 'non-uuid'
    req.body = { modelo: 'Modelo 4', marca: 'Marca 4', ano: '2021', numero: 4, status: 'disponivel' }
    const res = mockResponse() as any
    const next = mockNext as any

    updateBicicleta(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
        message: 'ID inválido'
      })
    )
    expect(res.status).not.toHaveBeenCalled() // No need to check status when next is called
    expect(res.json).not.toHaveBeenCalled() // No need to check json when next is called
  })

  test('should return status 400 if year or number has non-numeric character', () => {
    const req = mockRequest() as any
    req.params.id = 'a2f43e3b-f0f6-40fd-a6a7-dea545076333'
    req.body = { modelo: 'Modelo 4', marca: 'Marca 4', ano: 'abc', numero: 4, status: 'disponivel' }
    const res = mockResponse() as any
    const next = mockNext as any

    updateBicicleta(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
        message: 'Algum campo foi preenchido com caracter(es) inválido(s)'
      })
    )
    expect(res.status).not.toHaveBeenCalled() // No need to check status when next is called
    expect(res.json).not.toHaveBeenCalled() // No need to check json when next is called
  })

  test('should return status 400 bad request if id is not provided', () => {
    const req = mockRequest() as any
    req.params.id = null
    req.body = { modelo: 'Modelo 4', marca: 'Marca 4', ano: '2021', numero: 4, status: 'disponivel' }
    const res = mockResponse() as any
    const next = mockNext as any

    updateBicicleta(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
        message: 'ID inválido'
      })
    )
    expect(res.status).not.toHaveBeenCalled() // No need to check status when next is called
    expect(res.json).not.toHaveBeenCalled() // No need to check json when next is called
  })

  test('should return status 404 not found if uuid is valid but doesn\'t match any bicicleta', () => {
    const req = mockRequest() as any
    // comparing to 'a2f43e3b-f0f6-40fd-a6a7-dea545076333'
    req.params.id = 'a2f43e3b-f0f6-40fd-a6a7-dea545076334'
    req.body = { modelo: 'Modelo 4', marca: 'Marca 4', ano: '2021', numero: 4, status: 'disponivel' }
    const res = mockResponse() as any
    const next = mockNext as any

    updateBicicleta(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 404,
        message: 'Bicicleta não encontrada'
      })
    )
    expect(res.status).not.toHaveBeenCalled() // No need to check status when next is called
    expect(res.json).not.toHaveBeenCalled() // No need to check json when next is called
  })

  test('should return status 400 bad request if a a mandatory field is not provided', () => {
    const req = mockRequest() as any
    req.params.id = 'a2f43e3b-f0f6-40fd-a6a7-dea545076333'
    req.body = { modelo: 'Modelo 4', marca: 'Marca 4', ano: '2021' }
    const res = mockResponse() as any
    const next = mockNext as any

    updateBicicleta(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
        message: 'Campos obrigatórios não preenchidos'
      })
    )
    expect(res.status).not.toHaveBeenCalled() // No need to check status when next is called
    expect(res.json).not.toHaveBeenCalled() // No need to check json when next is called
  })

  test('should return status 400 bad request if a field is not valid', () => {
    const req = mockRequest() as any
    req.params.id = 'a2f43e3b-f0f6-40fd-a6a7-dea545076333'
    req.body = { modelo: 'Modelo 4', marca: 'Marca 4', ano: 'abc', numero: 4 }
    const res = mockResponse() as any
    const next = mockNext as any

    updateBicicleta(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
        message: 'Algum campo foi preenchido com caracter(es) inválido(s)'
      })
    )
    expect(res.status).not.toHaveBeenCalled() // No need to check status when next is called
    expect(res.json).not.toHaveBeenCalled() // No need to check json when next is called
  })
})

describe('Controller deleteBicicleta', () => {
  test('should return status 204 no content', () => {
    const req = mockRequest() as any
    req.params.id = 'a2f43e3b-f0f6-40fd-a6a7-dea545076333'
    const res = mockResponse() as any
    const next = mockNext as any

    deleteBicicleta(req, res, next)

    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.json).toHaveBeenCalledWith()
  })

  test('should return status 400 bad request if id doesn\'t match UUID format', () => {
    const req = mockRequest() as any
    req.params.id = 'non-uuid'
    const res = mockResponse() as any
    const next = mockNext as any

    deleteBicicleta(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
        message: 'ID inválido'
      })
    )
    expect(res.status).not.toHaveBeenCalled() // No need to check status when next is called
    expect(res.json).not.toHaveBeenCalled() // No need to check json when next is called
  })

  test('should return status 400 bad request if id is not provided', () => {
    const req = mockRequest() as any
    req.params.id = null
    const res = mockResponse() as any
    const next = mockNext as any

    deleteBicicleta(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
        message: 'ID inválido'
      })
    )
    expect(res.status).not.toHaveBeenCalled() // No need to check status when next is called
    expect(res.json).not.toHaveBeenCalled() // No need to check json when next is called
  })

  test('should return status 404 not found if uuid is valid but doesn\'t match any bicicleta', () => {
    const req = mockRequest() as any
    // comparing to 'a2f43e3b-f0f6-40fd-a6a7-dea545076333'
    req.params.id = 'a2f43e3b-f0f6-40fd-a6a7-dea545076334'
    const res = mockResponse() as any
    const next = mockNext as any

    deleteBicicleta(req, res, next)

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 404,
        message: 'Bicicleta não encontrada'
      })
    )
  })
})
