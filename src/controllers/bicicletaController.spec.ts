import { Request, Response, NextFunction } from 'express'
import * as BicicletaController from './bicicletaController'
import * as BicicletaService from '../services/bicicletaService'
import * as TrancaService from '../services/trancaService'
import { status } from '../enums/statusBicicletaEnum'
import { ApiError } from '../error/ApiError'
import { Bicicleta } from '../models/bicicletaModel'

const validId = 1
const invalidNumber = 'not-a-number'
const invalidId = invalidNumber
const notFoundId = -1

const expectResCalledWith = (res: Response, next: NextFunction, expectRes?: Bicicleta | Bicicleta[] | ApiError, expectSuccessStatus?: number): void => {
  if (expectSuccessStatus !== undefined) {
    expect(res.status).toHaveBeenCalledWith(expectSuccessStatus)
    if (expectRes !== undefined) expect(res.json).toHaveBeenCalledWith(expectRes)
    else expect(res.json).toHaveBeenCalledWith()
    expect(next).not.toHaveBeenCalled()
    return
  }
  expect(next).toHaveBeenCalledWith(expectRes)
}

const bicicletaBody: Bicicleta = {
  modelo: 'Modelo X',
  marca: 'Marca X',
  numero: 9,
  ano: '2023',
  status: status.DISPONIVEL
}

describe('bicicletaController', () => {
  describe('getBicicleta', () => {
    it('should return bicicletas with status 200', async () => {
      const req = {} as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      const bicicletas = [
        { ...bicicletaBody, id: 1, marca: 'Marca 1', modelo: 'Modelo 1' },
        { ...bicicletaBody, id: 2, marca: 'Marca 2', modelo: 'Modelo 2' }
      ]
      jest.spyOn(BicicletaService, 'getAllBicicletas').mockResolvedValue(bicicletas)
      await (BicicletaController.getBicicleta(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, bicicletas, 200)
    })
  })

  describe('getBicicletaById', () => {
    it('should return bicicleta with status 200', async () => {
      const req = { params: { id: validId } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      const bicicleta = { ...bicicletaBody, id: validId }
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue(bicicleta)
      await (BicicletaController.getBicicletaById(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, bicicleta, 200)
    })

    it('should return ApiError with status 422 when id is invalid', async () => {
      const req = { params: { id: invalidId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (BicicletaController.getBicicletaById(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('ID inválido'))
    })

    it('should return ApiError with status 404 when id is not found', async () => {
      const req = { params: { id: notFoundId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'getBicicletaById').mockRejectedValueOnce(new Error('Bicicleta não encontrada'))
      await (BicicletaController.getBicicletaById(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Bicicleta não encontrada'))
    })
  })

  describe('createBicicleta', () => {
    it('should return bicicleta with status 201', async () => {
      const req = { body: { ...bicicletaBody } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'createBicicleta').mockResolvedValue({ ...bicicletaBody, id: validId })
      await (BicicletaController.createBicicleta(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, { ...bicicletaBody, id: validId }, 201)
    })

    it('should return ApiError with status 422 when body doesn\'t have a mandatory field', async () => {
      const req = { body: { ...bicicletaBody, modelo: undefined } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (BicicletaController.createBicicleta(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 422 when body has an invalid field', async () => {
      const req = { body: { ...bicicletaBody, numero: invalidNumber } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (BicicletaController.createBicicleta(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })
  })

  describe('updateBicicleta', () => {
    it('should return bicicleta with status 200', async () => {
      const req = {
        params: { id: validId }, body: { ...bicicletaBody }
      } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      const bicicleta = { ...bicicletaBody, id: validId }
      jest.spyOn(BicicletaService, 'updateBicicleta').mockResolvedValue(bicicleta)
      await (BicicletaController.updateBicicleta(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, bicicleta, 200)
    })

    it('should return ApiError with status 422 when body doesn\'t have a mandatory field', async () => {
      const req = {
        params: { id: validId }, body: { ...bicicletaBody, modelo: undefined }
      } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (BicicletaController.updateBicicleta(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 422 when body has an invalid field', async () => {
      const req = {
        params: { id: validId }, body: { ...bicicletaBody, numero: invalidNumber }
      } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (BicicletaController.updateBicicleta(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })

    it('should return ApiError with status 422 when id is invalid', async () => {
      const req = {
        params: { id: invalidId }, body: { ...bicicletaBody }
      } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (BicicletaController.updateBicicleta(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('ID inválido'))
    })

    it('should return ApiError with status 404 when id is not found', async () => {
      const req = {
        params: { id: notFoundId }, body: { ...bicicletaBody }
      } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'updateBicicleta').mockRejectedValueOnce(new Error('Bicicleta não encontrada'))
      await (BicicletaController.updateBicicleta(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Bicicleta não encontrada'))
    })
  })

  describe('deleteBicicleta', () => {
    it('should return bicicleta with status 200', async () => {
      const req = { params: { id: validId } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'deleteBicicleta').mockResolvedValue()
      await (BicicletaController.deleteBicicleta(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, undefined, 200)
    })

    it('should return ApiError with status 422 when id is invalid', async () => {
      const req = { params: { id: invalidId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (BicicletaController.deleteBicicleta(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('ID inválido'))
    })

    it('should return ApiError with status 404 when id is not found', async () => {
      const req = { params: { id: notFoundId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'deleteBicicleta').mockRejectedValueOnce(new Error('Bicicleta não encontrada'))
      await (BicicletaController.deleteBicicleta(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Bicicleta não encontrada'))
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

  const integrarNaRedeBody = {
    bicicletaId: validId,
    trancaId: validId,
    funcionarioId: validId
  }

  describe('integrarNaRede', () => {
    it('should return 200 OK and the updated bicicleta', async () => {
      const req = { body: { ...integrarNaRedeBody } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue({ ...bicicleta, status: status.NOVA })
      jest.spyOn(BicicletaService, 'updateBicicleta').mockResolvedValue({ ...bicicleta, status: status.DISPONIVEL })
      jest.spyOn(TrancaService, 'insertBicicleta').mockResolvedValue({ ...tranca, status: status.EM_USO })
      await (BicicletaController.integrarNaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, { ...bicicleta, status: status.DISPONIVEL }, 200)
    })

    it('should return ApiError with status 422 when body is missing a field', async () => {
      const req = { body: { ...integrarNaRedeBody, bicicletaId: undefined } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (BicicletaController.integrarNaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 422 when body has an invalid field', async () => {
      const req = { body: { ...integrarNaRedeBody, bicicletaId: invalidId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (BicicletaController.integrarNaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })

    it('should return ApiError with status 404 when tranca status is not DISPONIVEL', async () => {
      const req = { body: { ...integrarNaRedeBody } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.EM_USO })
      await (BicicletaController.integrarNaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Tranca indisponível'))
    })

    it('should return ApiError with status 404 when bicicleta status is not NOVA or EM_REPARO', async () => {
      const req = { body: { ...integrarNaRedeBody } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue({ ...bicicleta, status: status.DISPONIVEL })
      await (BicicletaController.integrarNaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Bicicleta já integrada na rede ou aposentada'))
    })

    it('should return ApiError with status 404 when bicicleta is not found', async () => {
      const req = { body: { ...integrarNaRedeBody, bicicletaId: notFoundId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      jest.spyOn(BicicletaService, 'getBicicletaById').mockRejectedValueOnce(new Error('Bicicleta não encontrada'))
      await (BicicletaController.integrarNaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Bicicleta não encontrada'))
    })

    it('should return ApiError with status 404 when tranca is not found', async () => {
      const req = { body: { ...integrarNaRedeBody, trancaId: notFoundId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockRejectedValueOnce(new Error('Tranca não encontrada'))
      await (BicicletaController.integrarNaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Tranca não encontrada'))
    })
  })

  const retirarDaRedeBody = {
    ...integrarNaRedeBody,
    statusAcaoReparador: status.EM_REPARO
  }

  describe('retirarDaRede', () => {
    it('should return 200 OK and the updated bicicleta', async () => {
      const req = { body: { ...retirarDaRedeBody } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, bicicletaId: validId, status: status.EM_USO })
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue({ ...bicicleta, status: status.DISPONIVEL })
      jest.spyOn(BicicletaService, 'updateBicicleta').mockResolvedValue({ ...bicicleta, status: status.EM_REPARO })
      jest.spyOn(TrancaService, 'removeBicicleta').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      await (BicicletaController.retirarDaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, { ...bicicleta, status: status.EM_REPARO }, 200)
    })

    it('should return ApiError with status 422 when body is missing a field', async () => {
      const req = { body: { ...retirarDaRedeBody, trancaId: undefined } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (BicicletaController.retirarDaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 422 when body has an invalid field', async () => {
      const req = { body: { ...retirarDaRedeBody, bicicletaId: 'invalidId' } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (BicicletaController.retirarDaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })

    it('should return ApiError with status 422 when statusAcaoReparador is invalid', async () => {
      const req = { body: { ...retirarDaRedeBody, statusAcaoReparador: 'invalidStatus' } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (BicicletaController.retirarDaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Status inválido, deve ser "em reparo" ou "aposentada"'))
    })

    it('should return ApiError with status 422 when bicicleta and tranca are not connected', async () => {
      const req = { body: { ...retirarDaRedeBody } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, bicicletaId: notFoundId, status: status.EM_USO })
      await (BicicletaController.retirarDaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Bicicleta não está conectada a tranca informada'))
    })

    it('should return ApiError with status 404 when bicicleta is not found', async () => {
      const req = { body: { ...retirarDaRedeBody } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'getBicicletaById').mockRejectedValue(new Error('Bicicleta não encontrada'))
      await (BicicletaController.retirarDaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Bicicleta não encontrada'))
    })

    it('should return ApiError with status 404 when tranca is not found', async () => {
      const req = { body: { ...retirarDaRedeBody } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockRejectedValue(new Error('Tranca não encontrada'))
      await (BicicletaController.retirarDaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Tranca não encontrada'))
    })
  })

  describe('setStatus', () => {
    it('should return 200 OK and the updated bicicleta', async () => {
      const req = { params: { id: validId, statusAcao: status.REPARO_SOLICITADO } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'setStatus').mockResolvedValue({ ...bicicleta, status: status.REPARO_SOLICITADO })
      await (BicicletaController.setStatus(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, { ...bicicleta, status: status.REPARO_SOLICITADO }, 200)
    })

    it('should return ApiError with status 422 if statusAcao is nor REPARO_SOLICITADO or DISPONIVEL', async () => {
      const req = { params: { id: validId, statusAcao: status.EM_USO } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      await (BicicletaController.setStatus(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Use esse endpoint apenas com "reparo solicitado" ou para desfazer uma solicitação de reparo ("disponível"), qualquer outro status é redundante'))
    })

    it('should return ApiError with status 404 when bicicleta is not found', async () => {
      const req = { params: { id: notFoundId, statusAcao: status.REPARO_SOLICITADO } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'setStatus').mockRejectedValue(new Error('Bicicleta não encontrada'))
      await (BicicletaController.setStatus(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Bicicleta não encontrada'))
    })
  })
})
