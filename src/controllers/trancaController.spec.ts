import { makeSut } from '../utils/interceptor'
import {
  getTranca,
  getTrancaById,
  createTranca,
  updateTranca,
  deleteTranca,
  integrarNaRede,
  retirarDaRede
} from './trancaController'
import { status } from '../enums/statusTrancaEnum'

describe('Controller trancaController', () => {
  const testBody = {
    totemId: 3,
    numero: 2,
    anoDeFabricacao: '2020',
    modelo: 'Modelo Teste',
    status: status.DISPONIVEL
  } as any

  const testExistentBody = {
    id: 6,
    totemId: 3,
    numero: 6,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 6',
    status: status.DISPONIVEL,
    localizacao: 'Localização 3'
  } as any

  const errorBody = {
    invalidId: {
      code: 400, message: 'ID inválido'
    },
    invalidFK: {
      code: 400, message: 'TotemID inválido / não encontrado'
    },
    mandatoryNotFilled: {
      code: 400, message: 'Campos obrigatórios não preenchidos'
    },
    invalidField: {
      code: 400, message: 'Algum campo foi preenchido com caracter(es) inválido(s)'
    },
    notFound: {
      code: 404, message: 'Tranca não encontrada'
    },
    notDisponivel: {
      code: 400, message: 'Tranca não disponível, verifique se está conectada a uma bicicleta ou se já foi retirada da rede'
    },
    totemNotFound: {
      code: 404, message: 'Totem não encontrado'
    },
    alreadyIntegrated: {
      code: 400, message: 'Tranca já integrada na rede'
    },
    retireeTranca: {
      code: 400, message: 'Tranca aposentada'
    },
    invalidAcaoStatus: {
      code: 400, message: 'Status inválido, deve ser "em reparo" ou "aposentada"'
    },
    trancaNotInTotem: {
      code: 400, message: 'Tranca não está instalada no totem informado'
    }
  }

  const testExistentId = 6
  const testNonExistentId = -1
  const testInvalidNumber = 'not-a-number'
  const testInvalidTotemId = -1
  const testValidTotemId = 3
  const testExistentFuncionarioId = 1
  const testNewId = 7

  const testExistentNewBody = {
    numero: 7,
    anoDeFabricacao: '2020',
    modelo: 'Modelo 7',
    status: status.NOVA
  } as any

  const testIntegrarNaRedeBody = {
    trancaId: testNewId,
    funcionarioId: testExistentFuncionarioId,
    totemId: testValidTotemId
  } as any

  const testRetirarDaRedeBody = {
    trancaId: testExistentId,
    funcionarioId: testExistentFuncionarioId,
    totemId: testValidTotemId,
    statusAcaoReparador: status.APOSENTADA
  } as any

  const expectResCalledWith = (successStatus: any, res: any, expectStatus: any, expectRes?: any): void => {
    if (successStatus !== null) {
      expect(successStatus).toHaveBeenCalledWith(expectStatus)
    }
    if (expectRes !== undefined) {
      expect(res).toHaveBeenCalledWith(expectRes)
    } else {
      expect(res).toHaveBeenCalled()
    }
  }

  describe('Controller integrarNaRede', () => {
    it('should return 200 OK and the updated tranca', () => {
      const body = testIntegrarNaRedeBody
      const { req, res, next } = makeSut(undefined, body)
      integrarNaRede(req, res, next)
      expectResCalledWith(
        res.status, res.json,
        200, expect.objectContaining({ ...testExistentNewBody, status: status.DISPONIVEL })
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testIntegrarNaRedeBody, trancaId: undefined }
      const { req, res, next } = makeSut(undefined, body)
      integrarNaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.mandatoryNotFilled)
      )
    })

    it('should return 400 BAD REQUEST if a field is not valid', () => {
      const body = { ...testIntegrarNaRedeBody, trancaId: testInvalidNumber }
      const { req, res, next } = makeSut(undefined, body)
      integrarNaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidField)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any tranca', () => {
      const body = { ...testIntegrarNaRedeBody, trancaId: testNonExistentId }
      const { req, res, next } = makeSut(undefined, body)
      integrarNaRede(req, res, next)
      expectResCalledWith(
        null, next,
        404, expect.objectContaining(errorBody.notFound)
      )
    })

    it('should return 400 BAD REQUEST if tranca is already integrated', () => {
      const body = { ...testIntegrarNaRedeBody, trancaId: 1, totemId: 3 }
      const { req, res, next } = makeSut(undefined, body)
      integrarNaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.alreadyIntegrated)
      )
    })

    it('should return 400 BAD REQUEST if tranca status=aposentada', () => {
      const body = { ...testIntegrarNaRedeBody, trancaId: 8, totemId: 3 }
      const { req, res, next } = makeSut(undefined, body)
      integrarNaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.retireeTranca)
      )
    })

    it('should return 400 BAD REQUEST if totem not found', () => {
      const body = { ...testIntegrarNaRedeBody, totemId: testNonExistentId }
      const { req, res, next } = makeSut(undefined, body)
      integrarNaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.totemNotFound)
      )
    })
  })

  describe('Controller retirarDaRede', () => {
    it('should return 200 OK and the updated tranca', () => {
      const body = { ...testRetirarDaRedeBody, trancaId: 5, totemId: 2 }
      const { req, res, next } = makeSut(undefined, body)
      retirarDaRede(req, res, next)
      expectResCalledWith(
        res.status, res.json,
        200, expect.objectContaining({ id: 5, status: status.APOSENTADA })
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testRetirarDaRedeBody, trancaId: undefined }
      const { req, res, next } = makeSut(undefined, body)
      retirarDaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.mandatoryNotFilled)
      )
    })

    it('should return 400 BAD REQUEST if a field is not valid', () => {
      const body = { ...testRetirarDaRedeBody, trancaId: testInvalidNumber }
      const { req, res, next } = makeSut(undefined, body)
      retirarDaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidField)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any tranca', () => {
      const body = { ...testRetirarDaRedeBody, trancaId: testNonExistentId }
      const { req, res, next } = makeSut(undefined, body)
      retirarDaRede(req, res, next)
      expectResCalledWith(
        null, next,
        404, expect.objectContaining(errorBody.notFound)
      )
    })

    it('should return 400 BAD REQUEST if statusAcao field is invalid', () => {
      const body = { ...testRetirarDaRedeBody, trancaId: 2, statusAcaoReparador: 'invalid' }
      const { req, res, next } = makeSut(undefined, body)
      retirarDaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidAcaoStatus)
      )
    })

    it('should return 400 BAD REQUEST if tranca status is not "disponivel"', () => {
      const body = { ...testRetirarDaRedeBody, trancaId: 1, totemId: 1 }
      const { req, res, next } = makeSut(undefined, body)
      retirarDaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.notDisponivel)
      )
    })

    it('should return 400 BAD REQUEST if totem not found', () => {
      const body = { ...testRetirarDaRedeBody, totemId: testNonExistentId }
      const { req, res, next } = makeSut(undefined, body)
      retirarDaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.totemNotFound)
      )
    })

    it('should return 400 BAD REQUEST if tranca is not in totem', () => {
      const body = { ...testRetirarDaRedeBody, trancaId: 4, totemId: 1 }
      const { req, res, next } = makeSut(undefined, body)
      retirarDaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.trancaNotInTotem)
      )
    })
  })

  describe('Controller getTranca', () => {
    it('should return 200 OK and a list of trancas', () => {
      const { req, res, next } = makeSut()
      getTranca(req, res, next)
      expectResCalledWith(
        res.status, res.json,
        200, expect.arrayContaining([testExistentBody])
      )
    })
  })

  describe('Controller getTrancaById', () => {
    it('should return 200 OK and a tranca', () => {
      const { req, res, next } = makeSut(testExistentId)
      getTrancaById(req, res, next)
      expectResCalledWith(
        res.status, res.json,
        200, expect.objectContaining(testExistentBody)
      )
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const { req, res, next } = makeSut(testInvalidNumber)
      getTrancaById(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const { req, res, next } = makeSut()
      getTrancaById(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any tranca', () => {
      const { req, res, next } = makeSut(testNonExistentId)
      getTrancaById(req, res, next)
      expectResCalledWith(
        null, next,
        404, expect.objectContaining(errorBody.notFound)
      )
    })
  })

  describe('Controller createTranca', () => {
    it('should return 201 CREATED and created the tranca', () => {
      const body = { ...testBody }
      delete body.totemId
      const { req, res, next } = makeSut(undefined, body)
      createTranca(req, res, next)
      expectResCalledWith(
        res.status, res.json, 201, expect.objectContaining({
          ...req.body,
          id: expect.any(Number),
          localizacao: 'Não instalada',
          status: status.NOVA
        })
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testBody }
      delete body.modelo
      const { req, res, next } = makeSut(undefined, body)
      createTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.mandatoryNotFilled)
      )
    })

    it('should return 400 BAD REQUEST if a field is not valid', () => {
      const body = { ...testBody }
      body.anoDeFabricacao = testInvalidNumber
      const { req, res, next } = makeSut(undefined, body)
      createTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidField)
      )
    })
  })

  describe('Controller updateTranca', () => {
    it('should return 200 OK and the updated tranca', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testExistentId, body)
      updateTranca(req, res, next)
      expectResCalledWith(
        res.status, res.json, 200, expect.objectContaining({
          ...req.body, id: testExistentId
        })
      )
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testInvalidNumber, body)
      updateTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 400 BAD REQUEST if a field is not valid', () => {
      const body = { ...testBody }
      body.anoDeFabricacao = testInvalidNumber
      const { req, res, next } = makeSut(testExistentId, body)
      updateTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidField)
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(undefined, body)
      updateTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any tranca', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testNonExistentId, body)
      updateTranca(req, res, next)
      expectResCalledWith(
        null, next,
        404, expect.objectContaining(errorBody.notFound)
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testBody }
      delete body.modelo
      const { req, res, next } = makeSut(testExistentId, body)
      updateTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.mandatoryNotFilled)
      )
    })

    it('should return 400 BAD REQUEST if a foreignkey is invalid', () => {
      const body = { ...testBody }
      body.totemId = testInvalidTotemId
      const { req, res, next } = makeSut(testExistentId, body)
      updateTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidFK)
      )
    })
  })

  describe('Controller deleteTranca', () => {
    it('should return 200 OK', () => {
      const { req, res, next } = makeSut(testExistentId)
      deleteTranca(req, res, next)
      expectResCalledWith(res.status, res.json, 200)
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const { req, res, next } = makeSut(testInvalidNumber)
      deleteTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const { req, res, next } = makeSut()
      deleteTranca(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any tranca', () => {
      const { req, res, next } = makeSut(testNonExistentId)
      deleteTranca(req, res, next)
      expectResCalledWith(
        null, next,
        404, expect.objectContaining(errorBody.notFound)
      )
    })
  })
})
