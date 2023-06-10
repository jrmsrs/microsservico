import express from 'express'
import { loggerMiddleware } from './logger'
import { corsMiddleware } from './cors'
import jsonParser from './jsonParser'
import docsMiddleware from './docs'

export default (app: express.Application): void => {
  app.use(loggerMiddleware)
  app.use(corsMiddleware)
  app.use(jsonParser.jsonMiddleware)
  app.use(jsonParser.urlencodedMiddleware)
  app.use(docsMiddleware.path, docsMiddleware.serve, docsMiddleware.setup)
}
