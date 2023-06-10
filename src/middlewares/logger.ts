import { Request } from 'express'
import morgan from 'morgan'

const toIgnore = /(css|js|png|jpg|jpeg|svg|ico|woff|woff2|ttf|eot|map)/

export const loggerMiddleware = morgan('dev', {
  skip: (req: Request) => toIgnore.exec(req.path) !== null
})
