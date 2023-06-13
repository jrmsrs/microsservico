import { NextFunction, Request, Response } from 'express'
import * as Tranca from '../models/trancaModel'
import * as Totem from '../models/totemModel'
import { ApiError } from '../error/ApiError'
import { randomUUID, UUID } from 'crypto'
import { isValidUUID } from '../utils/uuid'

export const getTranca = (req: Request, res: Response, next: NextFunction): void => {
  const trancas = Tranca.getTrancas() as any[]
  trancas.forEach((tranca) => {
    tranca.localizacao = Totem.getTotemById(tranca.totemId)?.localizacao
  })
  res.status(200).json(trancas)
}

export const getTrancaById = (req: Request, res: Response, next: NextFunction): void => {
  const id = req.params.id as UUID
  if (!isValidUUID(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  if (Tranca.getTrancaById(id) == null) {
    next(ApiError.notFound('Tranca não encontrada'))
    return
  }
  const tranca = Tranca.getTrancaById(id) as any
  tranca.localizacao = Totem.getTotemById(tranca.totemId)?.localizacao
  res.status(200).json(tranca)
}

export const createTranca = (req: Request, res: Response, next: NextFunction): void => {
  const { totemId, numero, anoDeFabricacao, modelo } = req.body
  const id = randomUUID()
  if (totemId === undefined || numero === undefined || anoDeFabricacao === undefined || modelo === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(anoDeFabricacao) || isNaN(numero)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  const totem = Totem.getTotemById(totemId)
  if (totem === undefined) {
    next(ApiError.badRequest('TotemID inválido / não encontrado'))
    return
  }
  Tranca.createTranca({ id, totemId, numero, anoDeFabricacao, modelo, status: 'disponivel' })
  const tranca = Tranca.getTrancaById(id) as any
  tranca.localizacao = totem.localizacao
  res.status(201).json(tranca)
}

export const updateTranca = (req: Request, res: Response, next: NextFunction): void => {
  const id = req.params.id as UUID
  const { totemId, numero, anoDeFabricacao, modelo, status } = req.body
  if (!isValidUUID(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  if (Tranca.getTrancaById(id) == null) {
    next(ApiError.notFound('Tranca não encontrada'))
    return
  }
  if (totemId === undefined || numero === undefined || anoDeFabricacao === undefined || modelo === undefined || status === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(anoDeFabricacao) || isNaN(numero)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  const totem = Totem.getTotemById(totemId)
  if (totem === undefined) {
    next(ApiError.badRequest('TotemID inválido / não encontrado'))
    return
  }
  Tranca.updateTranca(id, { id, totemId, numero, anoDeFabricacao, modelo, status })
  const tranca = Tranca.getTrancaById(id) as any
  tranca.localizacao = Totem.getTotemById(tranca.totemId)?.localizacao
  res.status(200).json(tranca)
}

export const deleteTranca = (req: Request, res: Response, next: NextFunction): void => {
  const id = req.params.id as UUID
  if (!isValidUUID(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  if (Tranca.getTrancaById(id) == null) {
    next(ApiError.notFound('Tranca não encontrada'))
    return
  }
  Tranca.deleteTranca(id)
  res.status(200).json()
}