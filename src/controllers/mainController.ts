import { Request, Response } from 'express'

export const mainController = (req: Request, res: Response): void => {
  res.redirect(303, '/docs')
}
