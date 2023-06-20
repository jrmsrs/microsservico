import { makeSut } from '../utils/interceptor'
import {
  getBicicleta,
  getBicicletaById,
  createBicicleta,
  updateBicicleta,
  deleteBicicleta,
  integrarNaRede,
  retirarDaRede
} from './bicicletaController'
import { status } from '../enums/statusBicicletaEnum'

describe('Controller bicicletaController', () => {
  const testBody = {
    modelo: 'Modelo Teste',
    marca: 'Marca Teste',
    ano: '2021',
    numero: 4
  } as any

  const testExistentBody = {
    id: 2,
    modelo: 'Modelo 2',
    marca: 'Marca 2',
    ano: '2021',
    numero: 2
  } as any

  const errorBody = {
    invalidId: {
      code: 400, message: 'ID inválido'
    },
    mandatoryNotFilled: {
      code: 400, message: 'Campos obrigatórios não preenchidos'
    },
    invalidField: {
      code: 400, message: 'Algum campo foi preenchido com caracter(es) inválido(s)'
    },
    notFound: {
      code: 404, message: 'Bicicleta não encontrada'
    },
    notDisponivel: {
      code: 400, message: 'Bicicleta não disponível, verifique se está conectada a uma tranca ou se já foi retirada da rede'
    },
    trancaNotFound: {
      code: 404, message: 'Tranca não encontrada'
    },
    trancaBusy: {
      code: 400, message: 'Tranca indisponível'
    },
    alreadyIntegrated: {
      code: 400, message: 'Bicicleta já integrada na rede'
    },
    retireeBicicleta: {
      code: 400, message: 'Bicicleta aposentada'
    },
    invalidAcaoStatus: {
      code: 400, message: 'Status inválido, deve ser "em reparo" ou "aposentada"'
    },
    bicicletaNotInTranca: {
      code: 400, message: 'Tranca não está conectada a bicicleta'
    }
  }

  const testExistentId = 2
  const testNonExistentId = -1
  const testInvalidNumber = 'not-a-number'
  const testNewId = 4
  const testFreeTrancaId = 3
  const testBusyTrancaId = 2
  const testExistentFuncionarioId = 1

  const testExistentNewBody = {
    modelo: 'Modelo 4',
    marca: 'Marca 4',
    ano: '2021',
    numero: 4,
    status: status.NOVA
  } as any

  const testIntegrarNaRedeBody = {
    bicicletaId: testNewId,
    funcionarioId: testExistentFuncionarioId,
    trancaId: testFreeTrancaId
  } as any

  const testRetirarDaRedeBody = {
    bicicletaId: testExistentId,
    funcionarioId: testExistentFuncionarioId,
    trancaId: testBusyTrancaId,
    statusAcaoReparador: status.APOSENTADA
  } as any

  const expectResCalledWith = (successStatus: any, res: any, expectStatus: any = 200, expectRes?: any): void => {
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
    it('should return 200 OK and the updated bicicleta', () => {
      const body = testIntegrarNaRedeBody
      const { req, res, next } = makeSut(undefined, body)
      integrarNaRede(req, res, next)
      expectResCalledWith(
        res.status, res.json,
        200, expect.objectContaining({ ...testExistentNewBody, status: status.DISPONIVEL })
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testIntegrarNaRedeBody, bicicletaId: undefined }
      const { req, res, next } = makeSut(undefined, body)
      integrarNaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.mandatoryNotFilled)
      )
    })

    it('should return 400 BAD REQUEST if a field is not valid', () => {
      const body = { ...testIntegrarNaRedeBody, bicicletaId: testInvalidNumber }
      const { req, res, next } = makeSut(undefined, body)
      integrarNaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidField)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any bicicleta', () => {
      const body = { ...testIntegrarNaRedeBody, bicicletaId: testNonExistentId }
      const { req, res, next } = makeSut(undefined, body)
      integrarNaRede(req, res, next)
      expectResCalledWith(
        null, next,
        404, expect.objectContaining(errorBody.notFound)
      )
    })

    it('should return 400 BAD REQUEST if bicicleta is already integrated', () => {
      const body = { ...testIntegrarNaRedeBody, bicicletaId: 1, trancaId: 6 }
      const { req, res, next } = makeSut(undefined, body)
      integrarNaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.alreadyIntegrated)
      )
    })

    it('should return 400 BAD REQUEST if bicicleta status=aposentada', () => {
      const body = { ...testIntegrarNaRedeBody, bicicletaId: 5, trancaId: 6 }
      const { req, res, next } = makeSut(undefined, body)
      integrarNaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.retireeBicicleta)
      )
    })

    it('should return 400 BAD REQUEST if tranca not found', () => {
      const body = { ...testIntegrarNaRedeBody, trancaId: testNonExistentId }
      const { req, res, next } = makeSut(undefined, body)
      integrarNaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.trancaNotFound)
      )
    })

    it('should return 400 BAD REQUEST if tranca is not available', () => {
      const body = { ...testIntegrarNaRedeBody, trancaId: 1 }
      const { req, res, next } = makeSut(undefined, body)
      integrarNaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.trancaBusy)
      )
    })
  })

  describe('Controller retirarDaRede', () => {
    it('should return 200 OK and the updated bicicleta', () => {
      const body = { ...testRetirarDaRedeBody, bicicletaId: 1, trancaId: 1 }
      const { req, res, next } = makeSut(undefined, body)
      retirarDaRede(req, res, next)
      expectResCalledWith(
        res.status, res.json,
        200, expect.objectContaining({ id: 1, status: status.APOSENTADA })
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testRetirarDaRedeBody, bicicletaId: undefined }
      const { req, res, next } = makeSut(undefined, body)
      retirarDaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.mandatoryNotFilled)
      )
    })

    it('should return 400 BAD REQUEST if a field is not valid', () => {
      const body = { ...testRetirarDaRedeBody, bicicletaId: testInvalidNumber }
      const { req, res, next } = makeSut(undefined, body)
      retirarDaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidField)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any bicicleta', () => {
      const body = { ...testRetirarDaRedeBody, bicicletaId: testNonExistentId }
      const { req, res, next } = makeSut(undefined, body)
      retirarDaRede(req, res, next)
      expectResCalledWith(
        null, next,
        404, expect.objectContaining(errorBody.notFound)
      )
    })

    it('should return 400 BAD REQUEST if statusAcao field is invalid', () => {
      const body = { ...testRetirarDaRedeBody, bicicletaId: 2, statusAcaoReparador: 'invalid' }
      const { req, res, next } = makeSut(undefined, body)
      retirarDaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidAcaoStatus)
      )
    })

    it('should return 400 BAD REQUEST if bicicleta status is not "disponivel"', () => {
      const body = { ...testRetirarDaRedeBody, bicicletaId: 3 }
      const { req, res, next } = makeSut(undefined, body)
      retirarDaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.notDisponivel)
      )
    })

    it('should return 400 BAD REQUEST if tranca not found', () => {
      const body = { ...testRetirarDaRedeBody, trancaId: testNonExistentId }
      const { req, res, next } = makeSut(undefined, body)
      retirarDaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.trancaNotFound)
      )
    })

    it('should return 400 BAD REQUEST if bicicleta is not in tranca', () => {
      const body = { ...testRetirarDaRedeBody, bicicletaId: 2, trancaId: 1 }
      const { req, res, next } = makeSut(undefined, body)
      retirarDaRede(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.bicicletaNotInTranca)
      )
    })
  })

  describe('Controller getBicicleta', () => {
    it('should return 200 OK and a list of bicicletas', () => {
      const { req, res, next } = makeSut()
      getBicicleta(req, res, next)
      expectResCalledWith(
        res.status, res.json,
        200, expect.arrayContaining([expect.objectContaining(testExistentBody)])
      )
    })
  })

  describe('Controller getBicicletaById', () => {
    it('should return 200 OK and a bicicleta', () => {
      const { req, res, next } = makeSut(testExistentId)
      getBicicletaById(req, res, next)
      expectResCalledWith(
        res.status, res.json,
        200, expect.objectContaining(testExistentBody)
      )
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const { req, res, next } = makeSut(testInvalidNumber)
      getBicicletaById(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const { req, res, next } = makeSut()
      getBicicletaById(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any bicicleta', () => {
      const { req, res, next } = makeSut(testNonExistentId)
      getBicicletaById(req, res, next)
      expectResCalledWith(
        null, next,
        404, expect.objectContaining(errorBody.notFound)
      )
    })
  })

  describe('Controller createBicicleta', () => {
    it('should return 201 CREATED and created the bicicleta', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(undefined, body)
      createBicicleta(req, res, next)
      expectResCalledWith(
        res.status, res.json, 201, expect.objectContaining({
          ...req.body,
          status: status.NOVA,
          id: expect.any(Number)
        })
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testBody }
      delete body.modelo
      const { req, res, next } = makeSut(undefined, body)
      createBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.mandatoryNotFilled)
      )
    })

    it('should return 400 BAD REQUEST if a field is not valid', () => {
      const body = { ...testBody }
      body.ano = testInvalidNumber
      const { req, res, next } = makeSut(undefined, body)
      createBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidField)
      )
    })
  })

  describe('Controller updateBicicleta', () => {
    it('should return 200 OK and the updated bicicleta', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testExistentId, body)
      updateBicicleta(req, res, next)
      expectResCalledWith(
        res.status, res.json, 200, expect.objectContaining({
          ...req.body, id: testExistentId
        })
      )
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testInvalidNumber, body)
      updateBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 400 BAD REQUEST if a field is not valid', () => {
      const body = { ...testBody }
      body.ano = testInvalidNumber
      const { req, res, next } = makeSut(testExistentId, body)
      updateBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidField)
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(undefined, body)
      updateBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any bicicleta', () => {
      const body = { ...testBody }
      const { req, res, next } = makeSut(testNonExistentId, body)
      updateBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        404, expect.objectContaining(errorBody.notFound)
      )
    })

    it('should return 400 BAD REQUEST if a mandatory field is not provided', () => {
      const body = { ...testBody }
      delete body.modelo
      const { req, res, next } = makeSut(testExistentId, body)
      updateBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.mandatoryNotFilled)
      )
    })
  })

  describe('Controller deleteBicicleta', () => {
    it('should return 200 OK', () => {
      const { req, res, next } = makeSut(testExistentId)
      deleteBicicleta(req, res, next)
      expectResCalledWith(res.status, res.json, 200)
    })

    it('should return 400 BAD REQUEST if id doesn\'t match UUID format', () => {
      const { req, res, next } = makeSut(testInvalidNumber)
      deleteBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 400 BAD REQUEST if id is not provided', () => {
      const { req, res, next } = makeSut()
      deleteBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        400, expect.objectContaining(errorBody.invalidId)
      )
    })

    it('should return 404 NOT FOUND if uuid is valid but doesn\'t match any bicicleta', () => {
      const { req, res, next } = makeSut(testNonExistentId)
      deleteBicicleta(req, res, next)
      expectResCalledWith(
        null, next,
        404, expect.objectContaining(errorBody.notFound)
      )
    })
  })
})
