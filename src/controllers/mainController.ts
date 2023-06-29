import { Request, Response } from 'express'

// @ts-expect-error - TS1064
export const mainController = async (req: Request, res: Response): void => {
  res.redirect(303, '/docs')
}
