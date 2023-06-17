import { NextFunction, Request, Response } from 'express'
import * as Totem from '../models/totemModel'
import { ApiError } from '../error/ApiError'

export const getTotem = (req: Request, res: Response, next: NextFunction): void => {
  const totens = Totem.getTotens()
  res.status(200).json(totens)
}

export const getTotemById = (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  const totem = Totem.getTotemById(id)
  if (Totem.getTotemById(id) === undefined) {
    next(ApiError.notFound('Totem não encontrado'))
    return
  }
  res.status(200).json(totem)
}

export const createTotem = (req: Request, res: Response, next: NextFunction): void => {
  const { descricao, localizacao } = req.body
  if (descricao === undefined || localizacao === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  const id = Totem.createTotem({ descricao, localizacao })
  res.status(201).json(Totem.getTotemById(id))
}

export const updateTotem = (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  const { descricao, localizacao } = req.body
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  if (Totem.getTotemById(id) === undefined) {
    next(ApiError.notFound('Totem não encontrado'))
    return
  }
  if (descricao === undefined || localizacao === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  Totem.updateTotem(id, { id, descricao, localizacao })
  res.status(200).json(Totem.getTotemById(id))
}

export const deleteTotem = (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  if (Totem.getTotemById(id) === undefined) {
    next(ApiError.notFound('Totem não encontrado'))
    return
  }
  Totem.deleteTotem(id)
  res.status(200).json()
}
