import { Request, Response } from 'express'

export const mainController = (req: Request, res: Response): void => {
  res.status(200).json({ message: 'A documentação das endpoints estão em /docs' })
}
