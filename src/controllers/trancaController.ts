import { NextFunction, Request, Response } from 'express'
import * as Tranca from '../models/trancaModel'
import * as Totem from '../models/totemModel'
import { ApiError } from '../error/ApiError'
import { status } from '../enums/statusTrancaEnum'

export const getTranca = (req: Request, res: Response, next: NextFunction): void => {
  const trancas = Tranca.getTrancas() as any[]
  trancas.forEach((tranca) => {
    tranca.localizacao = Totem.getTotemById(tranca.totemId)?.localizacao ?? 'Não instalada'
  })
  res.status(200).json(trancas)
}

export const getTrancaById = (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  if (Tranca.getTrancaById(id) === undefined) {
    next(ApiError.notFound('Tranca não encontrada'))
    return
  }
  const tranca = Tranca.getTrancaById(id) as any
  tranca.localizacao = Totem.getTotemById(tranca.totemId)?.localizacao ?? 'Não instalada'
  res.status(200).json(tranca)
}

export const createTranca = (req: Request, res: Response, next: NextFunction): void => {
  const { numero, anoDeFabricacao, modelo } = req.body
  if (numero === undefined || anoDeFabricacao === undefined || modelo === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(anoDeFabricacao) || isNaN(numero)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  const id = Tranca.createTranca({ numero, anoDeFabricacao, modelo, status: status.NOVA })
  const tranca = Tranca.getTrancaById(id) as any
  tranca.localizacao = 'Não instalada'
  res.status(201).json(tranca)
}

export const updateTranca = (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  const { totemId, numero, anoDeFabricacao, modelo } = req.body
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  const tranca = Tranca.getTrancaById(id)
  if (tranca === undefined) {
    next(ApiError.notFound('Tranca não encontrada'))
    return
  }
  if (numero === undefined || anoDeFabricacao === undefined || modelo === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(anoDeFabricacao) || isNaN(numero)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  const totem = Totem.getTotemById(totemId)
  if (totemId !== undefined && totem === undefined) {
    next(ApiError.badRequest('TotemID inválido / não encontrado'))
    return
  }
  Tranca.updateTranca(id, { id, numero, anoDeFabricacao, modelo, status: tranca.status, totemId: totemId ?? tranca.totemId })
  const updatedTranca = Tranca.getTrancaById(id) as any
  updatedTranca.localizacao = Totem.getTotemById(tranca.totemId)?.localizacao ?? 'Não instalada'
  // just for response, localizacao is not stored in database
  res.status(200).json(updatedTranca)
}

export const deleteTranca = (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  if (Tranca.getTrancaById(id) === undefined) {
    next(ApiError.notFound('Tranca não encontrada'))
    return
  }
  Tranca.deleteTranca(id)
  res.status(200).json()
}

export const integrarNaRede = (req: Request, res: Response, next: NextFunction): void => {
  const { trancaId, funcionarioId, totemId } = req.body
  if (trancaId === undefined || funcionarioId === undefined || totemId === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(trancaId) || isNaN(funcionarioId) || isNaN(totemId)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  const tranca = Tranca.getTrancaById(trancaId)
  if (tranca === undefined) {
    next(ApiError.notFound('Tranca não encontrada'))
    return
  }
  const totem = Totem.getTotemById(totemId)
  if (totem === undefined) {
    next(ApiError.notFound('Totem não encontrado'))
    return
  }
  if (tranca.status !== status.NOVA && tranca.status !== status.EM_REPARO) {
    next(ApiError.badRequest('Tranca já integrada na rede'))
    return
  }
  // verifica se funcionarioId é válido
  Tranca.updateTranca(trancaId, { ...tranca, status: status.DISPONIVEL, totemId })
  const updatedTranca = Tranca.getTrancaById(trancaId) as any
  updatedTranca.localizacao = Totem.getTotemById(totemId)?.localizacao ?? 'Não instalada'
  res.status(200).json(updatedTranca)
}

export const retirarDaRede = (req: Request, res: Response, next: NextFunction): void => {
  const { trancaId, funcionarioId, totemId, statusAcaoReparador } = req.body
  if (trancaId === undefined || funcionarioId === undefined || totemId === undefined || statusAcaoReparador === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(trancaId) || isNaN(funcionarioId) || isNaN(totemId)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  if (statusAcaoReparador !== status.EM_REPARO && statusAcaoReparador !== status.APOSENTADA) {
    next(ApiError.badRequest('Status inválido, deve ser "em reparo" ou "aposentada"'))
    return
  }
  const tranca = Tranca.getTrancaById(trancaId)
  if (tranca === undefined) {
    next(ApiError.notFound('Tranca não encontrada'))
    return
  }
  const totem = Totem.getTotemById(totemId)
  if (totem === undefined) {
    next(ApiError.notFound('Totem não encontrado'))
    return
  }
  if (tranca.totemId !== totemId) {
    next(ApiError.badRequest('Tranca não está instalada no totem informado'))
    return
  }
  // verifica se funcionarioId é válido
  Tranca.updateTranca(trancaId, { ...tranca, status: statusAcaoReparador, totemId: undefined })
  const updatedTranca = Tranca.getTrancaById(trancaId)
  res.status(200).json({ ...updatedTranca, localizacao: 'Não instalada' })
}
