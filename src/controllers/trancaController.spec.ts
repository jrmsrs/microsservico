import { Request, Response, NextFunction } from 'express'
import * as TotemService from '../services/totemService'
import * as TrancaController from './trancaController'
import * as TrancaService from '../services/trancaService'
import * as BicicletaService from '../services/bicicletaService'
import { status } from '../enums/statusTrancaEnum'
import { ApiError } from '../error/ApiError'

const validId = 1
const invalidNumber = 'not-a-number'
const invalidId = invalidNumber
const notFoundId = -1

describe('trancaController', () => {
  describe('getTranca', () => {
    it('should return trancas with status 200', async () => {
      const mockRequest: Request = {} as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const mockNext = jest.fn() as any as NextFunction
      const trancas = [
        {
          id: 1,
          totemId: 1,
          numero: 1,
          anoDeFabricacao: '2021',
          modelo: 'Modelo 1',
          status: status.DISPONIVEL
        },
        {
          id: 2,
          totemId: 2,
          bicicletaId: 2,
          numero: 2,
          anoDeFabricacao: '2021',
          modelo: 'Modelo 2',
          status: status.EM_USO
        }
      ]
      jest.spyOn(TrancaService, 'getAllTrancas').mockResolvedValue(trancas)
      await (TrancaController.getTranca(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(trancas)
      expect(mockResponse.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ localizacao: expect.anything() })]))
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return tranca with status 200 with localizacao=\'Não instalada\' if totemId is undefined', async () => {
      const mockRequest: Request = {} as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const mockNext = jest.fn() as any as NextFunction
      const trancas = [
        {
          id: 1,
          numero: 1,
          anoDeFabricacao: '2021',
          modelo: 'Modelo 1',
          status: status.NOVA
        },
        {
          id: 2,
          totemId: 2,
          bicicletaId: 2,
          numero: 2,
          anoDeFabricacao: '2021',
          modelo: 'Modelo 2',
          status: status.EM_USO
        }
      ]
      jest.spyOn(TrancaService, 'getAllTrancas').mockResolvedValue(trancas)
      await (TrancaController.getTranca(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(trancas)
      expect(mockResponse.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ localizacao: 'Não instalada' })]))
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('getTrancaById', () => {
    it('should return tranca with status 200', async () => {
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
      const tranca = {
        id: 1,
        totemId: 1,
        numero: 1,
        anoDeFabricacao: '2021',
        modelo: 'Modelo 1',
        status: status.DISPONIVEL
      }
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue(tranca)
      await (TrancaController.getTrancaById(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(tranca)
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ localizacao: expect.anything() }))
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return tranca with status 200 with localizacao=\'Não instalada\' if totemId is undefined', async () => {
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
      const tranca = {
        id: 1,
        numero: 1,
        anoDeFabricacao: '2021',
        modelo: 'Modelo 1',
        status: status.NOVA
      }
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue(tranca)
      await (TrancaController.getTrancaById(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(tranca)
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ localizacao: 'Não instalada' }))
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
      await (TrancaController.getTrancaById(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
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
      jest.spyOn(TrancaService, 'getTrancaById').mockRejectedValueOnce(new Error('Tranca não encontrada'))
      await (TrancaController.getTrancaById(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Tranca não encontrada'))
    })
  })

  describe('createTranca', () => {
    it('should return tranca with status 201', async () => {
      const mockRequest: Request = {
        body: {
          totemId: 1,
          numero: 1,
          anoDeFabricacao: '2021',
          modelo: 'Modelo 1',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const mockNext = jest.fn() as any as NextFunction
      const tranca = {
        id: 1,
        totemId: 1,
        numero: 1,
        anoDeFabricacao: '2021',
        modelo: 'Modelo 1',
        status: status.DISPONIVEL
      }
      jest.spyOn(TrancaService, 'createTranca').mockResolvedValue(tranca)
      await (TrancaController.createTranca(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledWith(tranca)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return ApiError with status 400 when body doesn\'t have a mandatory field', async () => {
      const mockRequest: Request = {
        body: {
          totemId: 1,
          numero: 1,
          anoDeFabricacao: '2021',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (TrancaController.createTranca(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 400 when body has an invalid field', async () => {
      const mockRequest: Request = {
        body: {
          totemId: 1,
          numero: invalidNumber,
          anoDeFabricacao: '2021',
          modelo: 'Modelo 1',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (TrancaController.createTranca(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })
  })

  describe('updateTranca', () => {
    it('should return tranca with status 200', async () => {
      const mockRequest: Request = {
        params: {
          id: validId
        },
        body: {
          totemId: 1,
          numero: 1,
          anoDeFabricacao: '2021',
          modelo: 'Modelo 1',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const mockNext = jest.fn() as any as NextFunction
      const tranca = {
        id: 1,
        totemId: 1,
        numero: 1,
        anoDeFabricacao: '2021',
        modelo: 'Modelo 1',
        status: status.DISPONIVEL
      }
      jest.spyOn(TrancaService, 'updateTranca').mockResolvedValue(tranca)
      await (TrancaController.updateTranca(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(tranca)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return ApiError with status 400 when body doesn\'t have a mandatory field', async () => {
      const mockRequest: Request = {
        params: {
          id: validId
        },
        body: {
          totemId: 1,
          numero: 1,
          anoDeFabricacao: '2021',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (TrancaController.updateTranca(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 400 when body has an invalid field', async () => {
      const mockRequest: Request = {
        params: {
          id: validId
        },
        body: {
          totemId: 1,
          numero: invalidNumber,
          anoDeFabricacao: '2021',
          modelo: 'Modelo 1',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (TrancaController.updateTranca(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })

    it('should return ApiError with status 400 when id is invalid', async () => {
      const mockRequest: Request = {
        params: {
          id: invalidId
        },
        body: {
          totemId: 1,
          numero: 1,
          anoDeFabricacao: '2021',
          modelo: 'Modelo 1',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (TrancaController.updateTranca(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('ID inválido'))
    })

    it('should return ApiError with status 404 when totemId is provided but totem is not found', async () => {
      const mockRequest: Request = {
        params: {
          id: validId
        },
        body: {
          totemId: notFoundId,
          numero: 1,
          anoDeFabricacao: '2021',
          modelo: 'Modelo 1',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockRejectedValueOnce(new Error('Totem não encontrado'))
      await (TrancaController.updateTranca(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Totem não encontrado'))
    })

    it('should return ApiError with status 404 when id is not found', async () => {
      const mockRequest: Request = {
        params: {
          id: notFoundId
        },
        body: {
          totemId: 1,
          numero: 1,
          anoDeFabricacao: '2021',
          modelo: 'Modelo 1',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'updateTranca').mockRejectedValueOnce(new Error('Tranca não encontrada'))
      await (TrancaController.updateTranca(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Tranca não encontrada'))
    })
  })

  describe('deleteTranca', () => {
    it('should return tranca with status 200', async () => {
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
      jest.spyOn(TrancaService, 'deleteTranca').mockResolvedValue()
      await (TrancaController.deleteTranca(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
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
      await (TrancaController.deleteTranca(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
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
      jest.spyOn(TrancaService, 'deleteTranca').mockRejectedValueOnce(new Error('Tranca não encontrada'))
      await (TrancaController.deleteTranca(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Tranca não encontrada'))
    })
  })

  const tranca = {
    id: 1,
    totemId: 1,
    numero: 1,
    anoDeFabricacao: '2021',
    modelo: 'Modelo 1'
  }

  const totem = {
    id: 1,
    descricao: 'Descrição 1',
    localizacao: 'Localização 1'
  }

  describe('integrarNaRede', () => {
    it('should return 200 OK and the updated tranca', async () => {
      const mockRequest: Request = {
        body: {
          trancaId: validId,
          totemId: validId,
          funcionarioId: validId
        }
      } as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.NOVA })
      jest.spyOn(TrancaService, 'updateTranca').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      await (TrancaController.integrarNaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ ...tranca, status: status.DISPONIVEL, localizacao: totem.localizacao })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return ApiError with status 400 when body is missing a field', async () => {
      const mockRequest: Request = {
        body: {
          trancaId: validId,
          totemId: validId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (TrancaController.integrarNaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 400 when body has an invalid field', async () => {
      const mockRequest: Request = {
        body: {
          trancaId: invalidId,
          totemId: validId,
          funcionarioId: validId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (TrancaController.integrarNaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })

    it('should return ApiError with status 404 when tranca status is not NOVA or EM_REPARO', async () => {
      const mockRequest: Request = {
        body: {
          trancaId: validId,
          totemId: validId,
          funcionarioId: validId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      await (TrancaController.integrarNaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Tranca já integrada na rede ou aposentada'))
    })

    it('should return ApiError with status 404 when tranca is not found', async () => {
      const mockRequest: Request = {
        body: {
          trancaId: notFoundId,
          totemId: validId,
          funcionarioId: validId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      jest.spyOn(TrancaService, 'getTrancaById').mockRejectedValueOnce(new Error('Tranca não encontrada'))
      await (TrancaController.integrarNaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Tranca não encontrada'))
    })

    it('should return ApiError with status 404 when totem is not found', async () => {
      const mockRequest: Request = {
        body: {
          trancaId: validId,
          totemId: notFoundId,
          funcionarioId: validId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockRejectedValueOnce(new Error('Totem não encontrado'))
      await (TrancaController.integrarNaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Totem não encontrado'))
    })
  })

  describe('retirarDaRede', () => {
    it('should return 200 OK and the updated tranca', async () => {
      const mockRequest: Request = {
        body: {
          trancaId: validId,
          totemId: validId,
          funcionarioId: validId,
          statusAcaoReparador: status.EM_REPARO
        }
      } as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      jest.spyOn(TrancaService, 'updateTranca').mockResolvedValue({ ...tranca, status: status.EM_REPARO })
      await (TrancaController.retirarDaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ ...tranca, status: status.EM_REPARO, localizacao: 'Não instalada' })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return ApiError with status 400 when body is missing a field', async () => {
      const mockRequest: Request = {
        body: {
          trancaId: validId,
          totemId: validId,
          funcionarioId: validId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (TrancaController.retirarDaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 400 when body has an invalid field', async () => {
      const mockRequest: Request = {
        body: {
          trancaId: invalidId,
          totemId: validId,
          funcionarioId: validId,
          statusAcaoReparador: status.EM_REPARO
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (TrancaController.retirarDaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })

    it('should return ApiError with status 400 when statusAcaoReparador is invalid', async () => {
      const mockRequest: Request = {
        body: {
          trancaId: validId,
          totemId: validId,
          funcionarioId: validId,
          statusAcaoReparador: 'invalidStatus'
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (TrancaController.retirarDaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Status inválido, deve ser "em reparo" ou "aposentada"'))
    })

    it('should return ApiError with status 400 when tranca status is not DISPONIVEL', async () => {
      const mockRequest: Request = {
        body: {
          trancaId: validId,
          totemId: validId,
          funcionarioId: validId,
          statusAcaoReparador: status.EM_REPARO
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.EM_USO })
      await (TrancaController.retirarDaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Tranca não disponível, verifique se está conectada a uma bicicleta ou se já foi retirada da rede'))
    })

    it('should return ApiError with status 400 when tranca and totem are not connected', async () => {
      const mockRequest: Request = {
        body: {
          trancaId: validId,
          totemId: validId,
          funcionarioId: validId,
          statusAcaoReparador: status.EM_REPARO
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      // jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.DISPONIVEL, totemId: (tranca.totemId + 1) })
      await (TrancaController.retirarDaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Tranca não está instalada no totem informado'))
    })

    it('should return ApiError with status 404 when tranca is not found', async () => {
      const mockRequest: Request = {
        body: {
          trancaId: validId,
          totemId: validId,
          funcionarioId: validId,
          statusAcaoReparador: status.EM_REPARO
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockRejectedValue(new Error('Tranca não encontrada'))
      await (TrancaController.retirarDaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Tranca não encontrada'))
    })

    it('should return ApiError with status 404 when totem is not found', async () => {
      const mockRequest: Request = {
        body: {
          trancaId: validId,
          totemId: validId,
          funcionarioId: validId,
          statusAcaoReparador: status.EM_REPARO
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockRejectedValue(new Error('Totem não encontrado'))
      await (TrancaController.retirarDaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Totem não encontrado'))
    })
  })

  const bicicleta = {
    id: validId,
    modelo: 'modelo',
    marca: 'marca',
    numero: 1,
    ano: '2020'
  }

  describe('trancar', () => {
    it('should return 200 OK and the updated tranca', async () => {
      const mockRequest: Request = {
        params: {
          id: validId
        },
        body: {
          bicicletaId: validId
        }
      } as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue({ ...bicicleta, status: status.EM_USO })
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      jest.spyOn(BicicletaService, 'updateBicicleta').mockResolvedValue({ ...bicicleta, status: status.DISPONIVEL })
      jest.spyOn(TrancaService, 'updateTranca').mockResolvedValue({ ...tranca, bicicletaId: bicicleta.id, status: status.EM_USO })
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      await (TrancaController.trancar(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ ...tranca, bicicletaId: bicicleta.id, status: status.EM_USO, localizacao: totem.localizacao })
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('destrancar', () => {
    it('should return 200 OK and the updated tranca', async () => {
      const mockRequest: Request = {
        params: {
          id: validId
        },
        body: {
          bicicletaId: validId
        }
      } as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue({ ...bicicleta, status: status.DISPONIVEL })
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.EM_USO, bicicletaId: bicicleta.id })
      jest.spyOn(BicicletaService, 'updateBicicleta').mockResolvedValue({ ...bicicleta, status: status.EM_USO })
      jest.spyOn(TrancaService, 'updateTranca').mockResolvedValue({ ...tranca, bicicletaId: bicicleta.id, status: status.DISPONIVEL })
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      await (TrancaController.destrancar(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ ...tranca, bicicletaId: bicicleta.id, status: status.DISPONIVEL, localizacao: totem.localizacao })
      expect(mockNext).not.toHaveBeenCalled()
    })
  })
})
