import { NextFunction, Request, Response } from 'express'
import * as TotemService from '../services/totemService'
import { ApiError } from '../error/ApiError'

// @ts-expect-error - TS1064
export const getTotem = async (req: Request, res: Response, next: NextFunction): void => {
  const totens = await TotemService.getAllTotems()
  res.status(200).json(totens)
}

// @ts-expect-error - TS1064
export const getTotemById = async (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  try {
    const totem = await TotemService.getTotemById(id)
    res.status(200).json(totem)
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}

// @ts-expect-error - TS1064
export const createTotem = async (req: Request, res: Response, next: NextFunction): void => {
  const { descricao, localizacao } = req.body
  if (descricao === undefined || localizacao === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  const totem = await TotemService.createTotem({ descricao, localizacao })
  res.status(201).json(totem)
}

// @ts-expect-error - TS1064
export const updateTotem = async (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  const { descricao, localizacao } = req.body
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  if (descricao === undefined || localizacao === undefined) {
    next(ApiError.badRequest('Campos obrigatórios não preenchidos'))
    return
  }
  try {
    const totem = await TotemService.updateTotem(id, { id, descricao, localizacao })
    res.status(200).json(totem)
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}

// @ts-expect-error - TS1064
export const deleteTotem = async (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  try {
    await TotemService.deleteTotem(id)
    res.status(200).json()
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}

// @ts-expect-error - TS1064
export const getAllTrancas = async (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  try {
    const trancas = await TotemService.getAllTrancas(id)
    res.status(200).json(trancas)
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}

// @ts-expect-error - TS1064
export const getAllBicicletas = async (req: Request, res: Response, next: NextFunction): void => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    next(ApiError.badRequest('ID inválido'))
    return
  }
  try {
    const bicicletas = await TotemService.getAllBicicletas(id)
    res.status(200).json(bicicletas)
  } catch (error) {
    if (error instanceof Error) {
      next(ApiError.notFound(error.message))
    }
  }
}
