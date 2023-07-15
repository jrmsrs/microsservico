import { NextFunction, Request, Response } from 'express'
import * as BicicletaService from '../services/bicicletaService'
import * as TrancaService from '../services/trancaService'
import { ApiError } from '../error/ApiError'
import { status } from '../enums/statusBicicletaEnum'
import { status as statusTranca } from '../enums/statusTrancaEnum'
import { Aluguel, Externo } from '../http'

export const criaEmail = (assunto: string, status: string, dadosFuncionario: any, dadosBicicleta: any, dadosTranca: any): { email: string, assunto: string, mensagem: string } => {
  return {
    email: dadosFuncionario.email,
    assunto: `Bicicleta ID-${dadosBicicleta.id as string} ${assunto}`,
    mensagem: `\
Olá, ${dadosFuncionario.nome as string}!
A bicicleta ${dadosBicicleta.marca as string} - ${dadosBicicleta.modelo as string} de número ${dadosBicicleta.numero as number} foi ${assunto}, como "${status}", com sucesso!
Foi utilizada a tranca de modelo ${dadosTranca.modelo as string} e número ${dadosTranca.numero as number}, localizada no Totem ID-${dadosTranca.totemId as string} para realizar a operação.

Data e hora da operação: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}

Atenciosamente,
Sistema do Bicicletário`
  }
}

// @ts-expect-error - TS1064
export const getBicicleta = async (req: Request, res: Response, next: NextFunction): void => {
  const bicicletas = await BicicletaService.getAllBicicletas()
  res.status(200).json(bicicletas)
}

// @ts-expect-error - TS1064
export const getBicicletaById = async (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  try {
    const bicicleta = await BicicletaService.getBicicletaById(id)
    res.status(200).json(bicicleta)
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}

// @ts-expect-error - TS1064
export const createBicicleta = async (req: Request, res: Response, next: NextFunction): void => {
  const { modelo, marca, ano, numero } = req.body
  if (modelo === undefined || marca === undefined || ano === undefined || numero === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(ano) || isNaN(numero)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  const bicicleta = await BicicletaService.createBicicleta({ modelo, marca, ano, numero, status: status.NOVA })
  res.status(201).json(bicicleta)
}

// @ts-expect-error - TS1064
export const updateBicicleta = async (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  const { modelo, marca, ano, numero } = req.body
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  if (modelo === undefined || marca === undefined || ano === undefined || numero === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(ano) || isNaN(numero)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  try {
    const oldBicicleta = await BicicletaService.getBicicletaById(id)
    const bicicleta = await BicicletaService.updateBicicleta(id, { id, modelo, marca, ano, numero, status: oldBicicleta.status })
    res.status(200).json(bicicleta)
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}

// @ts-expect-error - TS1064
export const deleteBicicleta = async (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  try {
    await BicicletaService.deleteBicicleta(id)
    const tranca = await TrancaService.getTrancaByBicicletaId(id)
    if (tranca !== null) {
      await TrancaService.removeBicicleta(tranca.id as number)
    }
    res.status(200).json()
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}

// @ts-expect-error - TS1064
export const integrarNaRede = async (req: Request, res: Response, next: NextFunction): void => {
  const { bicicletaId, trancaId } = req.body
  const funcionarioId = /^[a-z0-9,-]{36}$/.exec(req.body.funcionarioId)?.[0] ?? null
  if (bicicletaId === undefined || funcionarioId === undefined || trancaId === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(Number(bicicletaId)) || isNaN(Number(trancaId))) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  try {
    const tranca = await TrancaService.getTrancaById(Number(trancaId))
    if (tranca.status !== statusTranca.DISPONIVEL) {
      next(ApiError.badRequest('Tranca indisponível'))
      return
    }
    const oldBicicleta = await BicicletaService.getBicicletaById(Number(bicicletaId))
    if (oldBicicleta.status !== status.EM_REPARO && oldBicicleta.status !== status.NOVA) {
      next(ApiError.badRequest('Bicicleta já integrada na rede ou aposentada'))
      return
    }
    const funcionario = await Aluguel.get(`/funcionario/${String(funcionarioId)}`)
    const bicicleta = await BicicletaService.updateBicicleta(Number(bicicletaId), { ...oldBicicleta, status: status.DISPONIVEL })
    await TrancaService.insertBicicleta(Number(trancaId), Number(bicicletaId))
    const emailGerado = criaEmail('integrada', status.DISPONIVEL, funcionario.data, bicicleta, tranca)
    await Externo.post('/enviarEmail', emailGerado)
      .then(() => {
        res.status(200).json({ tranca, emailGerado })
      })
      .catch(() => {
        res.status(200).json({
          aviso: 'Cheque se recebeu o e-mail',
          tranca,
          emailGerado
        })
      })
    res.status(200).json({ bicicleta, emailGerado })
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}

// @ts-expect-error - TS1064
export const retirarDaRede = async (req: Request, res: Response, next: NextFunction): void => {
  const { bicicletaId, trancaId, statusAcaoReparador } = req.body
  const funcionarioId = /^[a-z0-9,-]{36}$/.exec(req.body.funcionarioId)?.[0] ?? null
  if (bicicletaId === undefined || funcionarioId === undefined || trancaId === undefined || statusAcaoReparador === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(Number(bicicletaId)) || isNaN(Number(trancaId))) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  if (statusAcaoReparador !== 'em reparo' && statusAcaoReparador !== 'aposentada') {
    next(ApiError.badRequest('Status inválido, deve ser "em reparo" ou "aposentada"'))
    return
  }
  try {
    const tranca = await TrancaService.getTrancaById(Number(trancaId))
    const oldBicicleta = await BicicletaService.getBicicletaById(Number(bicicletaId))
    if (tranca.bicicletaId !== oldBicicleta.id) {
      next(ApiError.badRequest('Bicicleta não está conectada a tranca informada'))
      return
    }
    const funcionario = await Aluguel.get(`/funcionario/${String(funcionarioId)}`)
    const bicicleta = await BicicletaService.updateBicicleta(Number(bicicletaId), { ...oldBicicleta, status: statusAcaoReparador })
    await TrancaService.removeBicicleta(Number(trancaId))
    const emailGerado = criaEmail('retirada', statusAcaoReparador, funcionario.data, bicicleta, tranca)
    await Externo.post('/enviarEmail', emailGerado)
      .then(() => {
        res.status(200).json({ tranca, emailGerado })
      })
      .catch(() => {
        res.status(200).json({
          aviso: 'Cheque se recebeu o e-mail',
          tranca,
          emailGerado
        })
      })
    res.status(200).json({ bicicleta, emailGerado })
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}

// @ts-expect-error - TS1064
export const setStatus = async (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  const stat = req.params.statusAcao
  if (stat !== status.REPARO_SOLICITADO && stat !== status.DISPONIVEL) {
    next(ApiError.badRequest(
      'Use esse endpoint apenas com "reparo solicitado" ou para desfazer uma solicitação de reparo ("disponível"), qualquer outro status é redundante'
    ))
  }
  try {
    const bicicleta = await BicicletaService.setStatus(id, stat as status)
    res.status(200).json(bicicleta)
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}
