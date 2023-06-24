// Referência: Error Handling in Express | https://www.youtube.com/watch?v=DyqVqaf1KnA

import { NextFunction, Request, Response } from 'express'
import { ApiError, ErrorSchema } from './ApiError'

export const errorHandler = (
  err: Error | ApiError, req: Request, res: Response, next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.code).json(makeError(err.code, err.message as string))
    return
  }

  res.status(500).json(makeError(500, 'Something went wrong'))
}

export const makeError = (code: number, msg: string): ErrorSchema => {
  return { code, message: msg }
}
