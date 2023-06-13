import express from 'express'
import notFoundRouter from './notfoundRouter'
import bicicletaRouter from './bicicletaRouter'
import totemRouter from './totemRouter'
import trancaRouter from './trancaRouter'
import { mainController } from '../controllers/mainController'

const indexRouter = express.Router()

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Aplicação]
 *     summary: Rota principal
 *     responses:
 *       200:
 *         description: Retorna uma mensagem de boas vindas
 */
indexRouter.get('/', mainController)

export default (app: express.Application): void => {
  app.use('/', indexRouter)
  app.use('/bicicleta', bicicletaRouter)
  app.use('/totem', totemRouter)
  app.use('/tranca', trancaRouter)
  app.use('*', notFoundRouter)
}
