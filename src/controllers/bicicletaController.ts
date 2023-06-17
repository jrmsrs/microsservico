import { NextFunction, Request, Response } from 'express'
import * as Bicicleta from '../models/bicicletaModel'
import { ApiError } from '../error/ApiError'

export const getBicicleta = (req: Request, res: Response, next: NextFunction): void => {
  const bicicletas = Bicicleta.getBicicletas()
  res.status(200).json(bicicletas)
}

export const getBicicletaById = (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  const bicicleta = Bicicleta.getBicicletaById(id)
  if (Bicicleta.getBicicletaById(id) === undefined) {
    next(ApiError.notFound('Bicicleta não encontrada'))
    return
  }
  res.status(200).json(bicicleta)
}

export const createBicicleta = (req: Request, res: Response, next: NextFunction): void => {
  const { modelo, marca, ano, numero } = req.body
  const status = req.body.status ?? 'disponivel'
  if (modelo === undefined || marca === undefined || ano === undefined || numero === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(ano) || isNaN(numero)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  const id = Bicicleta.createBicicleta({ modelo, marca, ano, numero, status })
  res.status(201).json(Bicicleta.getBicicletaById(id))
}

export const updateBicicleta = (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  const { modelo, marca, ano, numero, status } = req.body
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  if (Bicicleta.getBicicletaById(id) === undefined) {
    next(ApiError.notFound('Bicicleta não encontrada'))
    return
  }
  if (modelo === undefined || marca === undefined || ano === undefined || numero === undefined || status === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(ano) || isNaN(numero)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  Bicicleta.updateBicicleta(id, { id, modelo, marca, ano, numero, status })
  res.status(200).json(Bicicleta.getBicicletaById(id))
}

export const deleteBicicleta = (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  if (Bicicleta.getBicicletaById(id) === undefined) {
    next(ApiError.notFound('Bicicleta não encontrada'))
    return
  }
  Bicicleta.deleteBicicleta(id)
  res.status(200).json()
}
