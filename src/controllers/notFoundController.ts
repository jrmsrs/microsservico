import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../error/ApiError'

export const notFoundController = (req: Request, res: Response, next: NextFunction): void => {
  // force a 500 error
  if (req.query?.throw !== undefined) {
    next(ApiError.internal())
  }
  next(ApiError.notFound('Page not found'))
}
