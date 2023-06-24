import { Request, Response, NextFunction } from 'express'
import * as BicicletaController from './bicicletaController'
import * as BicicletaService from '../services/bicicletaService'
import * as TrancaService from '../services/trancaService'
import { status } from '../enums/statusBicicletaEnum'
import { ApiError } from '../error/ApiError'

const validId = 1
const invalidNumber = 'not-a-number'
const invalidId = invalidNumber
const notFoundId = -1

describe('bicicletaController', () => {
  describe('getBicicleta', () => {
    it('should return bicicletas with status 200', async () => {
      const mockRequest: Request = {} as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const mockNext = jest.fn() as any as NextFunction
      const bicicletas = [
        {
          id: 1,
          modelo: 'Modelo 1',
          marca: 'Marca 1',
          numero: 1,
          ano: '2021',
          status: status.DISPONIVEL
        },
        {
          id: 2,
          modelo: 'Modelo 2',
          marca: 'Marca 2',
          numero: 2,
          ano: '2021',
          status: status.EM_USO
        }
      ]
      jest.spyOn(BicicletaService, 'getAllBicicletas').mockResolvedValue(bicicletas)
      await (BicicletaController.getBicicleta(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(bicicletas)
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('getBicicletaById', () => {
    it('should return bicicleta with status 200', async () => {
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
      const bicicleta = {
        id: 1,
        modelo: 'Modelo 1',
        marca: 'Marca 1',
        numero: 1,
        ano: '2021',
        status: status.DISPONIVEL
      }
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue(bicicleta)
      await (BicicletaController.getBicicletaById(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(bicicleta)
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
      await (BicicletaController.getBicicletaById(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
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
      jest.spyOn(BicicletaService, 'getBicicletaById').mockRejectedValueOnce(new Error('Bicicleta não encontrada'))
      await (BicicletaController.getBicicletaById(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Bicicleta não encontrada'))
    })
  })

  describe('createBicicleta', () => {
    it('should return bicicleta with status 201', async () => {
      const mockRequest: Request = {
        body: {
          modelo: 'Modelo 1',
          marca: 'Marca 1',
          numero: 1,
          ano: '2021',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const mockNext = jest.fn() as any as NextFunction
      const bicicleta = {
        id: 1,
        modelo: 'Modelo 1',
        marca: 'Marca 1',
        numero: 1,
        ano: '2021',
        status: status.DISPONIVEL
      }
      jest.spyOn(BicicletaService, 'createBicicleta').mockResolvedValue(bicicleta)
      await (BicicletaController.createBicicleta(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledWith(bicicleta)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return ApiError with status 400 when body doesn\'t have a mandatory field', async () => {
      const mockRequest: Request = {
        body: {
          marca: 'Marca 1',
          numero: 1,
          ano: '2021',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (BicicletaController.createBicicleta(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 400 when body has an invalid field', async () => {
      const mockRequest: Request = {
        body: {
          modelo: 'Modelo 1',
          marca: 'Marca 1',
          numero: invalidNumber,
          ano: '2021',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (BicicletaController.createBicicleta(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })
  })

  describe('updateBicicleta', () => {
    it('should return bicicleta with status 200', async () => {
      const mockRequest: Request = {
        params: {
          id: validId
        },
        body: {
          modelo: 'Modelo 1',
          marca: 'Marca 1',
          numero: 1,
          ano: '2021',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const mockNext = jest.fn() as any as NextFunction
      const bicicleta = {
        id: 1,
        modelo: 'Modelo 1',
        marca: 'Marca 1',
        numero: 1,
        ano: '2021',
        status: status.DISPONIVEL
      }
      jest.spyOn(BicicletaService, 'updateBicicleta').mockResolvedValue(bicicleta)
      await (BicicletaController.updateBicicleta(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(bicicleta)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return ApiError with status 400 when body doesn\'t have a mandatory field', async () => {
      const mockRequest: Request = {
        params: {
          id: validId
        },
        body: {
          marca: 'Marca 1',
          numero: 1,
          ano: '2021',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (BicicletaController.updateBicicleta(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
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
          modelo: 'Modelo 1',
          marca: 'Marca 1',
          numero: invalidNumber,
          ano: '2021',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (BicicletaController.updateBicicleta(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
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
          modelo: 'Modelo 1',
          marca: 'Marca 1',
          numero: 1,
          ano: '2021',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (BicicletaController.updateBicicleta(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
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
          modelo: 'Modelo 1',
          marca: 'Marca 1',
          numero: 1,
          ano: '2021',
          status: status.DISPONIVEL
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'updateBicicleta').mockRejectedValueOnce(new Error('Bicicleta não encontrada'))
      await (BicicletaController.updateBicicleta(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Bicicleta não encontrada'))
    })
  })

  describe('deleteBicicleta', () => {
    it('should return bicicleta with status 200', async () => {
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
      jest.spyOn(BicicletaService, 'deleteBicicleta').mockResolvedValue()
      await (BicicletaController.deleteBicicleta(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
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
      await (BicicletaController.deleteBicicleta(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
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
      jest.spyOn(BicicletaService, 'deleteBicicleta').mockRejectedValueOnce(new Error('Bicicleta não encontrada'))
      await (BicicletaController.deleteBicicleta(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Bicicleta não encontrada'))
    })
  })

  const bicicleta = {
    id: validId,
    modelo: 'Modelo 1',
    marca: 'Marca 1',
    numero: 1,
    ano: '2021'
  }
  const tranca = {
    id: 1,
    totemId: 1,
    numero: 1,
    anoDeFabricacao: '2021',
    modelo: 'Modelo 1'
  }

  describe('integrarNaRede', () => {
    it('should return 200 OK and the updated bicicleta', async () => {
      const mockRequest: Request = {
        body: {
          bicicletaId: validId,
          trancaId: validId,
          funcionarioId: validId
        }
      } as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue({ ...bicicleta, status: status.NOVA })
      jest.spyOn(BicicletaService, 'updateBicicleta').mockResolvedValue({ ...bicicleta, status: status.DISPONIVEL })
      jest.spyOn(TrancaService, 'insertBicicleta').mockResolvedValue({ ...tranca, status: status.EM_USO })
      await (BicicletaController.integrarNaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ ...bicicleta, status: status.DISPONIVEL })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return ApiError with status 400 when body is missing a field', async () => {
      const mockRequest: Request = {
        body: {
          bicicletaId: validId,
          trancaId: validId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (BicicletaController.integrarNaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 400 when body has an invalid field', async () => {
      const mockRequest: Request = {
        body: {
          bicicletaId: invalidId,
          trancaId: validId,
          funcionarioId: validId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (BicicletaController.integrarNaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })

    it('should return ApiError with status 404 when tranca status is not DISPONIVEL', async () => {
      const mockRequest: Request = {
        body: {
          bicicletaId: validId,
          trancaId: validId,
          funcionarioId: validId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.EM_USO })
      await (BicicletaController.integrarNaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Tranca indisponível'))
    })

    it('should return ApiError with status 404 when bicicleta status is not NOVA or EM_REPARO', async () => {
      const mockRequest: Request = {
        body: {
          bicicletaId: validId,
          trancaId: validId,
          funcionarioId: validId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue({ ...bicicleta, status: status.DISPONIVEL })
      await (BicicletaController.integrarNaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Bicicleta já integrada na rede ou aposentada'))
    })

    it('should return ApiError with status 404 when bicicleta is not found', async () => {
      const mockRequest: Request = {
        body: {
          bicicletaId: notFoundId,
          trancaId: validId,
          funcionarioId: validId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      jest.spyOn(BicicletaService, 'getBicicletaById').mockRejectedValueOnce(new Error('Bicicleta não encontrada'))
      await (BicicletaController.integrarNaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Bicicleta não encontrada'))
    })

    it('should return ApiError with status 404 when tranca is not found', async () => {
      const mockRequest: Request = {
        body: {
          bicicletaId: validId,
          trancaId: notFoundId,
          funcionarioId: validId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockRejectedValueOnce(new Error('Tranca não encontrada'))
      await (BicicletaController.integrarNaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Tranca não encontrada'))
    })
  })

  describe('retirarDaRede', () => {
    it('should return 200 OK and the updated bicicleta', async () => {
      const mockRequest: Request = {
        body: {
          bicicletaId: validId,
          trancaId: validId,
          funcionarioId: validId,
          statusAcaoReparador: status.EM_REPARO
        }
      } as any as Request
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, bicicletaId: validId, status: status.EM_USO })
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue({ ...bicicleta, status: status.DISPONIVEL })
      jest.spyOn(BicicletaService, 'updateBicicleta').mockResolvedValue({ ...bicicleta, status: status.EM_REPARO })
      jest.spyOn(TrancaService, 'removeBicicleta').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      await (BicicletaController.retirarDaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({ ...bicicleta, status: status.EM_REPARO })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return ApiError with status 400 when body is missing a field', async () => {
      const mockRequest: Request = {
        body: {
          bicicletaId: validId,
          trancaId: validId,
          funcionarioId: validId
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (BicicletaController.retirarDaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 400 when body has an invalid field', async () => {
      const mockRequest: Request = {
        body: {
          bicicletaId: invalidId,
          trancaId: validId,
          funcionarioId: validId,
          statusAcaoReparador: status.EM_REPARO
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (BicicletaController.retirarDaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })

    it('should return ApiError with status 400 when statusAcaoReparador is invalid', async () => {
      const mockRequest: Request = {
        body: {
          bicicletaId: validId,
          trancaId: validId,
          funcionarioId: validId,
          statusAcaoReparador: 'invalidStatus'
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      await (BicicletaController.retirarDaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Status inválido, deve ser "em reparo" ou "aposentada"'))
    })

    it('should return ApiError with status 400 when tranca status is not EM_USO', async () => {
      const mockRequest: Request = {
        body: {
          bicicletaId: validId,
          trancaId: validId,
          funcionarioId: validId,
          statusAcaoReparador: status.EM_REPARO
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, bicicletaId: validId, status: status.DISPONIVEL })
      await (BicicletaController.retirarDaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Tranca indisponível'))
    })

    it('should return ApiError with status 400 when bicicleta and tranca are not connected', async () => {
      const mockRequest: Request = {
        body: {
          bicicletaId: validId,
          trancaId: validId,
          funcionarioId: validId,
          statusAcaoReparador: status.EM_REPARO
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, bicicletaId: notFoundId, status: status.EM_USO })
      await (BicicletaController.retirarDaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.badRequest('Tranca não está conectada a bicicleta'))
    })

    it('should return ApiError with status 404 when bicicleta is not found', async () => {
      const mockRequest: Request = {
        body: {
          bicicletaId: validId,
          trancaId: validId,
          funcionarioId: validId,
          statusAcaoReparador: status.EM_REPARO
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'getBicicletaById').mockRejectedValue(new Error('Bicicleta não encontrada'))
      await (BicicletaController.retirarDaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Bicicleta não encontrada'))
    })

    it('should return ApiError with status 404 when tranca is not found', async () => {
      const mockRequest: Request = {
        body: {
          bicicletaId: validId,
          trancaId: validId,
          funcionarioId: validId,
          statusAcaoReparador: status.EM_REPARO
        }
      } as any as Request
      const mockResponse = {} as any as Response
      const mockNext = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockRejectedValue(new Error('Tranca não encontrada'))
      await (BicicletaController.retirarDaRede(mockRequest, mockResponse, mockNext) as unknown as Promise<void>)
      expect(mockResponse.status).toBe(undefined)
      expect(mockResponse.json).toBe(undefined)
      expect(mockNext).toHaveBeenCalledWith(ApiError.notFound('Tranca não encontrada'))
    })
  })
})
