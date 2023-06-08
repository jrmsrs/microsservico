import express from 'express'
import notFoundRouter from './notfoundRouter'
import bicicletaRouter from './bicicletaRouter'
import { mainController } from '../controllers/mainController'

const indexRouter = express.Router()

indexRouter.get('/', mainController)

export default (app: express.Application): void => {
  app.use('/', indexRouter)
  app.use('/bicicleta', bicicletaRouter)
  app.use('*', notFoundRouter)
}
