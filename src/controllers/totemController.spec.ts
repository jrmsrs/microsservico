import { Request, Response, NextFunction } from 'express'
import * as TotemController from './totemController'
import * as TotemService from '../services/totemService'
import { ApiError } from '../error/ApiError'

const validId = 1
const invalidId = 'not-a-number'
const notFoundId = -1

describe('totemController', () => {
  describe('getTotem', () => {
    it('should return totens with status 200', async () => {
      const mockRequest: Request = {} as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const mockNext = jest.fn() as any as NextFunction
      const totens = [
        {
          id: 1,
          localizacao: 'Localização 1',
          descricao: 'Descrição 1'
        },
        {
          id: 2,
          localizacao: 'Localização 2',
          descricao: 'Descrição 2'
        }
      ]
      jest.spyOn(TotemService, 'getAllTotems').mockResolvedValue(totens)
      await (TotemController.getTotem(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(totens)
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('getTotemById', () => {
    it('should return totem with status 200', async () => {
      const mockRequest: Request = {
        params: {
          id: validId
        }
      } as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const mockNext = jest.fn() as any as NextFunction
      const totem = {
        id: 1,
        localizacao: 'Localização 1',
        descricao: 'Descrição 1'
      }
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      await (TotemController.getTotemById(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(totem)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return ApiError with status 400 when id is invalid', async () => {
      const mockRequest: Request = {
        params: {
          id: invalidId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (TotemController.getTotemById(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('ID inválido'))
    })

    it('should return ApiError with status 404 when id is not found', async () => {
      const mockRequest: Request = {
        params: {
          id: notFoundId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockRejectedValueOnce(new Error('Totem não encontrado'))
      await (TotemController.getTotemById(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Totem não encontrado'))
    })
  })

  describe('createTotem', () => {
    it('should return totem with status 201', async () => {
      const mockRequest: Request = {
        body: {
          localizacao: 'Localização 1',
          descricao: 'Descrição 1'
        }
      } as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const mockNext = jest.fn() as any as NextFunction
      const totem = {
        id: 1,
        localizacao: 'Localização 1',
        descricao: 'Descrição 1'
      }
      jest.spyOn(TotemService, 'createTotem').mockResolvedValue(totem)
      await (TotemController.createTotem(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledWith(totem)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return ApiError with status 400 when body doesn\'t have a mandatory field', async () => {
      const mockRequest: Request = {
        body: {
          localizacao: 'Localização 1'
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (TotemController.createTotem(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })
  })

  describe('updateTotem', () => {
    it('should return totem with status 200', async () => {
      const mockRequest: Request = {
        params: {
          id: validId
        },
        body: {
          localizacao: 'Localização 1',
          descricao: 'Descrição 1'
        }
      } as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const mockNext = jest.fn() as any as NextFunction
      const totem = {
        id: 1,
        localizacao: 'Localização 1',
        descricao: 'Descrição 1'
      }
      jest.spyOn(TotemService, 'updateTotem').mockResolvedValue(totem)
      await (TotemController.updateTotem(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(totem)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return ApiError with status 400 when body doesn\'t have a mandatory field', async () => {
      const mockRequest: Request = {
        params: {
          id: validId
        },
        body: {
          localizacao: 'Localização 1'
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (TotemController.updateTotem(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 400 when id is invalid', async () => {
      const mockRequest: Request = {
        params: {
          id: invalidId
        },
        body: {
          localizacao: 'Localização 1',
          descricao: 'Descrição 1'
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (TotemController.updateTotem(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('ID inválido'))
    })

    it('should return ApiError with status 404 when id is not found', async () => {
      const mockRequest: Request = {
        params: {
          id: notFoundId
        },
        body: {
          localizacao: 'Localização 1',
          descricao: 'Descrição 1'
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'updateTotem').mockRejectedValueOnce(new Error('Totem não encontrado'))
      await (TotemController.updateTotem(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Totem não encontrado'))
    })
  })

  describe('deleteTotem', () => {
    it('should return totem with status 200', async () => {
      const mockRequest: Request = {
        params: {
          id: validId
        }
      } as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'deleteTotem').mockResolvedValue()
      await (TotemController.deleteTotem(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith()
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return ApiError with status 400 when id is invalid', async () => {
      const mockRequest: Request = {
        params: {
          id: invalidId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (TotemController.deleteTotem(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('ID inválido'))
    })

    it('should return ApiError with status 404 when id is not found', async () => {
      const mockRequest: Request = {
        params: {
          id: notFoundId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'deleteTotem').mockRejectedValueOnce(new Error('Totem não encontrado'))
      await (TotemController.deleteTotem(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Totem não encontrado'))
    })
  })
})
