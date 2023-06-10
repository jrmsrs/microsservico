import express from 'express'
import { notFoundController } from '../controllers/notFoundController'

const router = express.Router()

/**
 * @swagger
 * /{*}:
 *   get:
 *     tags: [Aplicação]
 *     summary: Rota para tratar requisições não encontradas
 *     responses:
 *       404:
 *         description: Rota não encontrada
 */
router.get('/', notFoundController)

export default router
