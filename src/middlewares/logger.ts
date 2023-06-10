import { Request } from 'express'
import morgan from 'morgan'

const toIgnore = /(css|js|png|jpg|jpeg|svg|ico|woff|woff2|ttf|eot|map)/

export const skip = (req: Request): boolean => toIgnore.exec(req.path) !== null

export const loggerMiddleware = morgan('dev', { skip })
