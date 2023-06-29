import { Request, Response, NextFunction } from 'express'
import * as TotemService from '../services/totemService'
import * as TrancaController from './trancaController'
import * as TrancaService from '../services/trancaService'
import * as BicicletaService from '../services/bicicletaService'
import { status } from '../enums/statusTrancaEnum'
import { status as statusBicicleta } from '../enums/statusBicicletaEnum'
import { ApiError } from '../error/ApiError'
import { Tranca } from '../models/trancaModel'
import { Aluguel, Externo } from '../http'

jest.mock('../http')

const validId = 1
const invalidNumber = 'not-a-number'
const invalidId = invalidNumber
const notFoundId = -1

const expectResCalledWith = (res: Response, next: NextFunction, expectRes?: any, expectSuccessStatus?: number): void => {
  if (expectSuccessStatus !== undefined) {
    expect(res.status).toHaveBeenCalledWith(expectSuccessStatus)
    if (expectRes !== undefined) expect(res.json).toHaveBeenCalledWith(expectRes)
    else expect(res.json).toHaveBeenCalledWith()
    expect(next).not.toHaveBeenCalled()
    return
  }
  expect(next).toHaveBeenCalledWith(expectRes)
}

const trancaBody: Tranca = {
  modelo: 'Modelo X',
  anoDeFabricacao: '2023',
  numero: 9,
  status: status.DISPONIVEL
}

describe('trancaController', () => {
  describe('getTranca', () => {
    it('should return trancas with status 200', async () => {
      const req = {} as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue({ id: validId, localizacao: 'Localização X', descricao: 'Descrição X' })
      jest.spyOn(TrancaService, 'getAllTrancas').mockResolvedValue([{ ...trancaBody, totemId: validId }])
      await (TrancaController.getTranca(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, [{ ...trancaBody, totemId: validId, localizacao: 'Localização X' }], 200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ localizacao: 'Localização X' })]))
    })

    it('should return tranca with status 200 with localizacao=\'Não instalada\' if totemId is undefined', async () => {
      const req = {} as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockRejectedValueOnce(new Error('Totem não encontrado'))
      jest.spyOn(TrancaService, 'getAllTrancas').mockResolvedValue([{ ...trancaBody }])
      await (TrancaController.getTranca(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, [{ ...trancaBody, localizacao: 'Não instalada' }], 200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ localizacao: 'Não instalada' })]))
    })
  })

  describe('getTrancaById', () => {
    it('should return tranca with status 200', async () => {
      const req = { params: { id: validId } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      const tranca = { ...trancaBody, id: validId }
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue(tranca)
      await (TrancaController.getTrancaById(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, tranca, 200)
    })

    it('should return tranca with status 200 with localizacao=\'Não instalada\' if totemId is undefined', async () => {
      const req = { params: { id: validId } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      const tranca = { ...trancaBody, id: validId }
      jest.spyOn(TotemService, 'getTotemById').mockRejectedValueOnce(new Error('Totem não encontrado'))
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue(tranca)
      await (TrancaController.getTrancaById(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, { ...tranca, localizacao: 'Não instalada' }, 200)
    })

    it('should return ApiError with status 422 when id is invalid', async () => {
      const req = { params: { id: invalidId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.getTrancaById(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('ID inválido'))
    })

    it('should return ApiError with status 404 when id is not found', async () => {
      const req = { params: { id: notFoundId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockRejectedValueOnce(new Error('Tranca não encontrada'))
      await (TrancaController.getTrancaById(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Tranca não encontrada'))
    })
  })

  describe('createTranca', () => {
    it('should return tranca with status 201', async () => {
      const req = { body: trancaBody } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      const tranca = { ...trancaBody, id: 1 }
      jest.spyOn(TrancaService, 'createTranca').mockResolvedValue(tranca)
      await (TrancaController.createTranca(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, tranca, 201)
    })

    it('should return ApiError with status 422 when body doesn\'t have a mandatory field', async () => {
      const req = { body: { ...trancaBody, modelo: undefined } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.createTranca(req, res, next) as unknown as Promise<void>)
      expect(res.status).toBe(undefined)
      expect(res.json).toBe(undefined)
      expect(next).toHaveBeenCalledWith(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 422 when body has an invalid field', async () => {
      const req = { body: { ...trancaBody, numero: invalidNumber } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.createTranca(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })
  })

  describe('updateTranca', () => {
    it('should return tranca with status 200', async () => {
      const req = { params: { id: validId }, body: trancaBody } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      const tranca = { ...trancaBody, id: validId }
      jest.spyOn(TrancaService, 'updateTranca').mockResolvedValue(tranca)
      await (TrancaController.updateTranca(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, tranca, 200)
    })

    it('should return ApiError with status 422 when body doesn\'t have a mandatory field', async () => {
      const req = { params: { id: validId }, body: { ...trancaBody, modelo: undefined } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.updateTranca(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 422 when body has an invalid field', async () => {
      const req = { params: { id: validId }, body: { ...trancaBody, numero: invalidNumber } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.updateTranca(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })

    it('should return ApiError with status 422 when id is invalid', async () => {
      const req = { params: { id: invalidId }, body: trancaBody } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.updateTranca(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('ID inválido'))
    })

    it('should return ApiError with status 404 when totemId is provided but totem is not found', async () => {
      const req = { params: { id: validId }, body: { ...trancaBody, totemId: notFoundId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockRejectedValueOnce(new Error('Totem não encontrado'))
      await (TrancaController.updateTranca(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Totem não encontrado'))
    })

    it('should return ApiError with status 404 when id is not found', async () => {
      const req = { params: { id: notFoundId }, body: trancaBody } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'updateTranca').mockRejectedValueOnce(new Error('Tranca não encontrada'))
      await (TrancaController.updateTranca(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Tranca não encontrada'))
    })
  })

  describe('deleteTranca', () => {
    it('should return tranca with status 200', async () => {
      const req = { params: { id: validId } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'deleteTranca').mockResolvedValue()
      await (TrancaController.deleteTranca(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, undefined, 200)
    })

    it('should return ApiError with status 422 when id is invalid', async () => {
      const req = { params: { id: invalidId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.deleteTranca(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('ID inválido'))
    })

    it('should return ApiError with status 404 when id is not found', async () => {
      const req = { params: { id: notFoundId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'deleteTranca').mockRejectedValueOnce(new Error('Tranca não encontrada'))
      await (TrancaController.deleteTranca(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Tranca não encontrada'))
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

  const integrarNaRedeBody = {
    trancaId: validId,
    totemId: validId,
    funcionarioId: validId
  }

  const funcionario = {
    matricula: validId,
    nome: 'Funcionario 1',
    cpf: '11111111111',
    email: 'funcionario@email.com',
    idade: 33,
    funcao: 'Funcionario'
  }

  describe('integrarNaRede', () => {
    it('should return 200 OK and the updated tranca', async () => {
      const req = { body: integrarNaRedeBody } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.NOVA })
      jest.spyOn(TrancaService, 'updateTranca').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      jest.spyOn(Aluguel, 'get').mockResolvedValueOnce({ data: funcionario })
      jest.spyOn(Externo, 'post').mockResolvedValue({ status: 200 })
      await (TrancaController.integrarNaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, expect.objectContaining({ tranca: { ...tranca, status: status.DISPONIVEL, localizacao: totem.localizacao } }), 200)
    })

    it('should return ApiError with status 422 when body is missing a field', async () => {
      const req = { body: { ...integrarNaRedeBody, trancaId: undefined } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.integrarNaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 422 when body has an invalid field', async () => {
      const req = { body: { ...integrarNaRedeBody, trancaId: invalidId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.integrarNaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })

    it('should return ApiError with status 404 when tranca status is not NOVA or EM_REPARO', async () => {
      const req = { body: integrarNaRedeBody } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      await (TrancaController.integrarNaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Tranca já integrada na rede ou aposentada'))
    })

    it('should return ApiError with status 404 when tranca is not found', async () => {
      const req = { body: { ...integrarNaRedeBody, trancaId: notFoundId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      jest.spyOn(TrancaService, 'getTrancaById').mockRejectedValueOnce(new Error('Tranca não encontrada'))
      await (TrancaController.integrarNaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Tranca não encontrada'))
    })

    it('should return ApiError with status 404 when totem is not found', async () => {
      const req = { body: { ...integrarNaRedeBody, totemId: notFoundId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockRejectedValueOnce(new Error('Totem não encontrado'))
      await (TrancaController.integrarNaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Totem não encontrado'))
    })

    it('should return ApiError with status 500 if email service fails', async () => {
      const req = { body: integrarNaRedeBody } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.NOVA })
      jest.spyOn(TrancaService, 'updateTranca').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      jest.spyOn(Aluguel, 'get').mockResolvedValueOnce({ data: funcionario })
      jest.spyOn(Externo, 'post').mockRejectedValue({ status: 500 })
      await (TrancaController.integrarNaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.internal(expect.stringContaining('A tranca foi integrada, mas')))
    })
  })

  const retirarDaRedeBody = {
    trancaId: validId,
    totemId: validId,
    funcionarioId: validId,
    statusAcaoReparador: status.EM_REPARO
  }

  describe('retirarDaRede', () => {
    it('should return 200 OK and the updated tranca', async () => {
      const req = { body: retirarDaRedeBody } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      jest.spyOn(TrancaService, 'updateTranca').mockResolvedValue({ ...tranca, status: status.EM_REPARO })
      jest.spyOn(Aluguel, 'get').mockResolvedValueOnce({ data: funcionario })
      jest.spyOn(Externo, 'post').mockResolvedValue({ status: 200 })
      await (TrancaController.retirarDaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, expect.objectContaining({ tranca: { ...tranca, status: status.EM_REPARO, localizacao: 'Não instalada' } }), 200)
    })

    it('should return ApiError with status 422 when body is missing a field', async () => {
      const req = { body: { ...retirarDaRedeBody, trancaId: undefined } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.retirarDaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 422 when body has an invalid field', async () => {
      const req = { body: { ...retirarDaRedeBody, trancaId: invalidId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.retirarDaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })

    it('should return ApiError with status 422 when statusAcaoReparador is invalid', async () => {
      const req = { body: { ...retirarDaRedeBody, statusAcaoReparador: 'invalidStatus' } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.retirarDaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Status inválido, deve ser "em reparo" ou "aposentada"'))
    })

    it('should return ApiError with status 422 when tranca status is not DISPONIVEL', async () => {
      const req = { body: { ...retirarDaRedeBody, statusAcaoReparador: status.EM_REPARO } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.EM_USO })
      await (TrancaController.retirarDaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Tranca não disponível, verifique se está conectada a uma bicicleta ou se já foi retirada da rede'))
    })

    it('should return ApiError with status 422 when tranca and totem are not connected', async () => {
      const req = { body: { ...retirarDaRedeBody, statusAcaoReparador: status.EM_REPARO } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.DISPONIVEL, totemId: (tranca.totemId + 1) })
      await (TrancaController.retirarDaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Tranca não está instalada no totem informado'))
    })

    it('should return ApiError with status 404 when tranca is not found', async () => {
      const req = { body: { ...retirarDaRedeBody, statusAcaoReparador: status.EM_REPARO } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TrancaService, 'getTrancaById').mockRejectedValue(new Error('Tranca não encontrada'))
      await (TrancaController.retirarDaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Tranca não encontrada'))
    })

    it('should return ApiError with status 404 when totem is not found', async () => {
      const req = { body: { ...retirarDaRedeBody, statusAcaoReparador: status.EM_REPARO } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockRejectedValue(new Error('Totem não encontrado'))
      await (TrancaController.retirarDaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Totem não encontrado'))
    })

    it('should return ApiError with status 500 if email service fails', async () => {
      const req = { body: retirarDaRedeBody } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      jest.spyOn(TrancaService, 'updateTranca').mockResolvedValue({ ...tranca, status: status.EM_REPARO })
      jest.spyOn(Aluguel, 'get').mockResolvedValueOnce({ data: funcionario })
      jest.spyOn(Externo, 'post').mockRejectedValue({ status: 500 })
      await (TrancaController.retirarDaRede(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.internal(expect.stringContaining('A tranca foi retirada, mas')))
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
      const req = { params: { id: validId }, body: { bicicletaId: validId } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue({ ...bicicleta, status: statusBicicleta.EM_USO })
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      jest.spyOn(BicicletaService, 'updateBicicleta').mockResolvedValue({ ...bicicleta, status: statusBicicleta.DISPONIVEL })
      jest.spyOn(TrancaService, 'updateTranca').mockResolvedValue({ ...tranca, bicicletaId: bicicleta.id, status: status.EM_USO })
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      await (TrancaController.trancar(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, { ...tranca, bicicletaId: bicicleta.id, status: status.EM_USO, localizacao: totem.localizacao }, 200)
    })

    it('should return ApiError with status 422 when body is missing a field', async () => {
      const req = { params: { id: validId }, body: {} } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.trancar(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 422 when body has an invalid field', async () => {
      const req = { params: { id: validId }, body: { bicicletaId: 'invalidId' } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.trancar(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })

    it('should return ApiError with status 422 when bicicleta status is not EM_USO', async () => {
      const req = { params: { id: validId }, body: { bicicletaId: validId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue({ ...bicicleta, status: statusBicicleta.DISPONIVEL })
      await (TrancaController.trancar(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Bicicleta já está trancada ou não está integrada na rede'))
    })

    it('should return ApiError with status 422 when tranca status is not DISPONIVEL', async () => {
      const req = { params: { id: validId }, body: { bicicletaId: validId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue({ ...bicicleta, status: statusBicicleta.EM_USO })
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.EM_USO })
      await (TrancaController.trancar(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Tranca não disponível, verifique se está conectada a uma bicicleta ou se foi retirada da rede'))
    })

    it('should return ApiError with status 404 when bicicleta is not found', async () => {
      const req = { params: { id: validId }, body: { bicicletaId: validId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'getBicicletaById').mockRejectedValue(new Error('Bicicleta não encontrada'))
      await (TrancaController.trancar(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Bicicleta não encontrada'))
    })

    it('should return ApiError with status 404 when tranca is not found', async () => {
      const req = { params: { id: validId }, body: { bicicletaId: validId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue({ ...bicicleta, status: statusBicicleta.EM_USO })
      jest.spyOn(TrancaService, 'getTrancaById').mockRejectedValue(new Error('Tranca não encontrada'))
      await (TrancaController.trancar(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Tranca não encontrada'))
    })
  })

  describe('destrancar', () => {
    it('should return 200 OK and the updated tranca', async () => {
      const req = { params: { id: validId }, body: { bicicletaId: validId } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue({ ...bicicleta, status: statusBicicleta.DISPONIVEL })
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.EM_USO, bicicletaId: bicicleta.id })
      jest.spyOn(BicicletaService, 'updateBicicleta').mockResolvedValue({ ...bicicleta, status: statusBicicleta.EM_USO })
      jest.spyOn(TrancaService, 'updateTranca').mockResolvedValue({ ...tranca, bicicletaId: bicicleta.id, status: status.DISPONIVEL })
      jest.spyOn(TotemService, 'getTotemById').mockResolvedValue(totem)
      await (TrancaController.destrancar(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, { ...tranca, bicicletaId: bicicleta.id, status: status.DISPONIVEL, localizacao: totem.localizacao }, 200)
    })

    it('should return ApiError with status 422 when body is missing a field', async () => {
      const req = { params: { id: validId }, body: {} } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.destrancar(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Campos obrigatórios não preenchidos'))
    })

    it('should return ApiError with status 422 when body has an invalid field', async () => {
      const req = { params: { id: validId }, body: { bicicletaId: 'invalidId' } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.destrancar(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    })

    it('should return ApiError with status 422 when bicicleta status is not DISPONIVEL', async () => {
      const req = { params: { id: validId }, body: { bicicletaId: validId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue({ ...bicicleta, status: statusBicicleta.EM_USO })
      await (TrancaController.destrancar(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Bicicleta não disponível, verifique está realmente trancada ou com reparo solicitado'))
    })

    it('should return ApiError with status 422 when tranca status is not EM_USO', async () => {
      const req = { params: { id: validId }, body: { bicicletaId: validId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue({ ...bicicleta, status: statusBicicleta.DISPONIVEL })
      jest.spyOn(TrancaService, 'getTrancaById').mockResolvedValue({ ...tranca, status: status.DISPONIVEL })
      await (TrancaController.destrancar(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest('Tranca não está trancada'))
    })

    it('should return ApiError with status 404 when bicicleta is not found', async () => {
      const req = { params: { id: validId }, body: { bicicletaId: validId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'getBicicletaById').mockRejectedValue(new Error('Bicicleta não encontrada'))
      await (TrancaController.destrancar(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Bicicleta não encontrada'))
    })

    it('should return ApiError with status 404 when tranca is not found', async () => {
      const req = { params: { id: validId }, body: { bicicletaId: validId } } as any as Request
      const res = {} as any as Response
      const next = jest.fn() as any as NextFunction
      jest.spyOn(BicicletaService, 'getBicicletaById').mockResolvedValue({ ...bicicleta, status: statusBicicleta.DISPONIVEL })
      jest.spyOn(TrancaService, 'getTrancaById').mockRejectedValue(new Error('Tranca não encontrada'))
      await (TrancaController.destrancar(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.notFound('Tranca não encontrada'))
    })
  })

  describe('setStatus', () => {
    it('should return 422 with message', async () => {
      const req = { params: { id: validId, statusAcao: 'any-status' } } as any as Request
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any as Response
      const next = jest.fn() as any as NextFunction
      await (TrancaController.setStatus(req, res, next) as unknown as Promise<void>)
      expectResCalledWith(res, next, ApiError.badRequest(
        'Altere o status da tranca pelos endpoints ' +
        "tranca/{trancaId}/trancar (ficará -> 'ocupada' com uma bicicleta); " +
        "/tranca/{tranca}/destrancar (ficará -> 'livre'); " +
        "/bicicleta/integrarNaRede (ficará -> 'livre' em um totem); " +
        "/bicicleta/retirarDaRede (ficará -> 'aposentada' ou 'em reparo')"
      ))
    })
  })
})
