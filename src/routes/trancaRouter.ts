import express from 'express'

import {
  getTranca,
  getTrancaById,
  createTranca,
  updateTranca,
  deleteTranca
} from '../controllers/trancaController'

const router = express.Router()

/**
 * @swagger
 * /tranca:
 *   get:
 *     tags: [Tranca]
 *     summary: Retorna todos as trancas cadastradas
 *     responses:
 *       200:
 *         description: Retorna um array com todos as trancas cadastradas
 */
router.get('/', getTranca)

/**
 * @swagger
 * /tranca/{id}:
 *   get:
 *     tags: [Tranca]
 *     summary: Retorna uma tranca pelo ID
 *     parameters:
 *      - $ref: '#/components/parameters/idTranca'
 *     responses:
 *       200:
 *         description: Retorna uma tranca pelo ID
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Tranca não encontrada
 */
router.get('/:id', getTrancaById)

/**
 * @swagger
 * /tranca:
 *   post:
 *     tags: [Tranca]
 *     summary: Cria uma tranca
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewTranca'
 *     responses:
 *       201:
 *         description: Retorna a tranca criada
 *       400:
 *         description: Erro de validação
 */
router.post('/', createTranca)

/**
 * @swagger
 * /tranca/{id}:
 *   put:
 *     tags: [Tranca]
 *     summary: Atualiza uma tranca pelo ID
 *     parameters:
 *       - $ref: '#/components/parameters/idTranca'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewTranca'
 *     responses:
 *       200:
 *         description: Retorna a tranca atualizada
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Tranca não encontrada
 */
router.put('/:id', updateTranca)

/**
 * @swagger
 * /tranca/{id}:
 *   delete:
 *     tags: [Tranca]
 *     summary: Deleta uma tranca pelo ID
 *     parameters:
 *       - $ref: '#/components/parameters/idTranca'
 *     responses:
 *       200:
 *         description: Dados removidos com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Tranca não encontrada
 */
router.delete('/:id', deleteTranca)

export default router
