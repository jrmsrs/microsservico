import { Request, Response, NextFunction } from 'express'
import * as TotemController from './totemController'
import * as TotemService from '../services/totemService'
import { ApiError } from '../error/ApiError'
import { Totem } from 'src/repositories/totem'

const validId = 1
const invalidId = 'not-a-number'
const notFoundId = -1

const expectResCalledWith = (res: Response, next: NextFunction, expectRes?: any, expectSuccessStatus?: number): void => {
  if (expectSuccessStatus !== undefined) {
    expect(res.status).toHaveBeenCalledWith(expectSuccessStatus)
    if (expectRes !== undefined) expect(res.json).toHaveBeenCalledWith(expectRes)
    else expect(res.json).toHaveBeenCalledWith()
    expect(next).not.toHaveBeenCalled()
  } else {
    expect(res.status).toBe(undefined)
    expect(res.json).toBe(undefined)
    expect(next).toHaveBeenCalledWith(expectRes)
  }
}

const totemBody: Totem = {
  localizacao: 'Localização X',
  descricao: 'Descrição X'
}

describe('totemController', () => {
  describe('getTotem', () => {
    it('should return totens with status 200', async () => {
      const req = {} as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      const totens = [
        { ...totemBody, id: 1, localizacao: 'Localização 1', descricao: 'Descrição 1' },
        { ...totemBody, id: 2, localizacao: 'Localização 2', descricao: 'Descrição 2' }
      ]
      jest.spyOn(TotemService, 'getAllTotems').mockResolvedValue(totens)
      await (TotemController.getTotem(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, totens, 200)
    })
  })

  describe('getTotemById', () => {
    it('should return totem with status 200', async () => {
      const req = { params: { id: validId } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      const totem = { ...totemBody, id: validId }
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      await (TotemController.getTotemById(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, totem, 200)
    })

    it('should return ApiError with status 400 when id is invalid', async () => {
      const req = { params: { id: invalidId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TotemController.getTotemById(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('ID inválido'))
    })

    it('should return ApiError with status 404 when id is not found', async () => {
      const req = { params: { id: notFoundId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockRejectedValueOnce(new Error('Totem não encontrado'))
      await (TotemController.getTotemById(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Totem não encontrado'))
    })
  })

  describe('createTotem', () => {
    it('should return totem with status 201', async () => {
      const req = { body: { ...totemBody } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      const totem = { ...totemBody, id: validId }
      jest.spyOn(TotemService, 'createTotem').mockResolvedValue(totem)
      await (TotemController.createTotem(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, totem, 201)
    })

    it('should return ApiError with status 400 when body doesn\'t have a mandatory field', async () => {
      const req = { body: { ...totemBody, localizacao: undefined } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TotemController.createTotem(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })
  })

  describe('updateTotem', () => {
    it('should return totem with status 200', async () => {
      const req = { params: { id: validId }, body: { ...totemBody } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      const totem = { ...totemBody, id: validId }
      jest.spyOn(TotemService, 'updateTotem').mockResolvedValue(totem)
      await (TotemController.updateTotem(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, totem, 200)
    })

    it('should return ApiError with status 400 when body doesn\'t have a mandatory field', async () => {
      const req = { params: { id: validId }, body: { ...totemBody, localizacao: undefined } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TotemController.updateTotem(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 400 when id is invalid', async () => {
      const req = { params: { id: invalidId }, body: { ...totemBody } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TotemController.updateTotem(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('ID inválido'))
    })

    it('should return ApiError with status 404 when id is not found', async () => {
      const req = { params: { id: notFoundId }, body: { ...totemBody } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'updateTotem').mockRejectedValueOnce(new Error('Totem não encontrado'))
      await (TotemController.updateTotem(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Totem não encontrado'))
    })
  })

  describe('deleteTotem', () => {
    it('should return totem with status 200', async () => {
      const req = { params: { id: validId } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'deleteTotem').mockResolvedValue()
      await (TotemController.deleteTotem(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, undefined, 200)
    })

    it('should return ApiError with status 400 when id is invalid', async () => {
      const req = { params: { id: invalidId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TotemController.deleteTotem(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('ID inválido'))
    })

    it('should return ApiError with status 404 when id is not found', async () => {
      const req = { params: { id: notFoundId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'deleteTotem').mockRejectedValueOnce(new Error('Totem não encontrado'))
      await (TotemController.deleteTotem(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Totem não encontrado'))
    })
  })

  describe('getAllTrancas', () => {
    const trancaBody = {
      id: validId,
      modelo: 'Modelo X',
      anoDeFabricacao: '2021',
      numero: 1
    }

    it('should return trancas with status 200', async () => {
      const req = { params: { id: validId } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      const trancas = [{ ...trancaBody, id: validId }]
      jest.spyOn(TotemService, 'getAllTrancas').mockResolvedValue(trancas)
      await (TotemController.getAllTrancas(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, trancas, 200)
    })

    it('should return ApiError with status 400 when id is invalid', async () => {
      const req = { params: { id: invalidId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TotemController.getAllTrancas(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('ID inválido'))
    })

    it('should return ApiError with status 404 when id is not found', async () => {
      const req = { params: { id: notFoundId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getAllTrancas').mockRejectedValueOnce(new Error('Totem não encontrado'))
      await (TotemController.getAllTrancas(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Totem não encontrado'))
    })
  })

  describe('getAllBicicletas', () => {
    const bicicletaBody = {
      id: validId,
      marca: 'Marca X',
      modelo: 'Modelo X',
      ano: '2021',
      numero: 1,
      status: 'Disponível'
    }

    it('should return bicicletas with status 200', async () => {
      const req = { params: { id: validId } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      const bicicletas = [{ ...bicicletaBody, id: validId }]
      jest.spyOn(TotemService, 'getAllBicicletas').mockResolvedValue(bicicletas)
      await (TotemController.getAllBicicletas(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, bicicletas, 200)
    })

    it('should return ApiError with status 400 when id is invalid', async () => {
      const req = { params: { id: invalidId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TotemController.getAllBicicletas(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('ID inválido'))
    })

    it('should return ApiError with status 404 when id is not found', async () => {
      const req = { params: { id: notFoundId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getAllBicicletas').mockRejectedValueOnce(new Error('Totem não encontrado'))
      await (TotemController.getAllBicicletas(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Totem não encontrado'))
    })
  })
})
