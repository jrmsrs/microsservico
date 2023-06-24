import express from 'express'
import notFoundRoute from './notfoundRoute'
import bicicletaRoute from './bicicletaRoute'
import totemRoute from './totemRoute'
import trancaRoute from './trancaRoute'
import { mainController } from '../controllers/mainController'

const indexRoute = express.Router()

indexRoute.get('/', mainController)

export default (app: express.Application): void => {
  app.use('/', indexRoute)
  app.use('/bicicleta', bicicletaRoute)
  app.use('/totem', totemRoute)
  app.use('/tranca', trancaRoute)
  app.use('*', notFoundRoute)
}
