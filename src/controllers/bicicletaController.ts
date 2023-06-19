import { NextFunction, Request, Response } from 'express'
import * as Bicicleta from '../models/bicicletaModel'
import * as Tranca from '../models/trancaModel'
import { ApiError } from '../error/ApiError'
import { status } from '../enums/statusBicicletaEnum'

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
  if (modelo === undefined || marca === undefined || ano === undefined || numero === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(ano) || isNaN(numero)) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  const id = Bicicleta.createBicicleta({ modelo, marca, ano, numero, status: status.NOVA })
  res.status(201).json(Bicicleta.getBicicletaById(id))
}

export const updateBicicleta = (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  const { modelo, marca, ano, numero } = req.body
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  const bicicleta = Bicicleta.getBicicletaById(id)
  if (bicicleta === undefined) {
    next(ApiError.notFound('Bicicleta não encontrada'))
    return
  }
  const status = bicicleta.status
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

export const integrarNaRede = (req: Request, res: Response, next: NextFunction): void => {
  const { bicicletaId, funcionarioId, trancaId } = req.body
  if (bicicletaId === undefined || funcionarioId === undefined || trancaId === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(Number(bicicletaId)) || isNaN(Number(funcionarioId)) || isNaN(Number(trancaId))) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  const bicicleta = Bicicleta.getBicicletaById(Number(bicicletaId))
  if (bicicleta === undefined) {
    next(ApiError.notFound('Bicicleta não encontrada'))
    return
  }
  const tranca = Tranca.getTrancaById(Number(trancaId))
  if (tranca === undefined) {
    next(ApiError.notFound('Tranca não encontrada'))
    return
  }
  if (tranca.status !== status.DISPONIVEL) {
    next(ApiError.badRequest('Tranca indisponível'))
    return
  }
  if (bicicleta.status !== status.EM_REPARO && bicicleta.status !== status.NOVA) {
    next(ApiError.badRequest('Bicicleta já integrada na rede'))
    return
  }
  Bicicleta.updateBicicleta(Number(bicicletaId), { ...bicicleta, status: status.DISPONIVEL })
  Tranca.insertBicicleta(Number(trancaId), Number(bicicletaId))
  res.status(200).json({ ...bicicleta, status: status.DISPONIVEL })
}

export const retirarDaRede = (req: Request, res: Response, next: NextFunction): void => {
  const { bicicletaId, funcionarioId, trancaId, statusAcaoReparador } = req.body
  if (bicicletaId === undefined || funcionarioId === undefined || trancaId === undefined || statusAcaoReparador === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  if (isNaN(Number(bicicletaId)) || isNaN(Number(funcionarioId)) || isNaN(Number(trancaId))) {
    next(ApiError.badRequest('Algum campo foi preenchido com caracter(es) inválido(s)'))
    return
  }
  if (statusAcaoReparador !== 'em reparo' && statusAcaoReparador !== 'aposentada') {
    next(ApiError.badRequest('Status inválido, deve ser "em reparo" ou "aposentada"'))
    return
  }
  const bicicleta = Bicicleta.getBicicletaById(Number(bicicletaId))
  if (bicicleta === undefined) {
    next(ApiError.notFound('Bicicleta não encontrada'))
    return
  }
  if (bicicleta.status !== status.DISPONIVEL) {
    next(ApiError.badRequest('Bicicleta não disponível'))
    return
  }
  const tranca = Tranca.getTrancaById(Number(trancaId))
  if (tranca === undefined) {
    next(ApiError.notFound('Tranca não encontrada'))
    return
  }
  if (tranca.bicicletaId !== bicicleta.id) {
    next(ApiError.badRequest('Tranca não está conectada a bicicleta'))
    return
  }
  Bicicleta.updateBicicleta(Number(bicicletaId), { ...bicicleta, status: statusAcaoReparador })
  Tranca.removeBicicleta(Number(trancaId))
  res.status(200).json({ ...bicicleta, status: statusAcaoReparador })
}
