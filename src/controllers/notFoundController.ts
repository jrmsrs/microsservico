import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../error/ApiError'

// @ts-expect-error - TS1064
export const notFoundController = async (req: Request, res: Response, next: NextFunction): void => {
  // force a 500 error
  if (req.query?.throw !== undefined) {
    next(ApiError.internal())
  }
  next(ApiError.notFound('Page not found'))
}
