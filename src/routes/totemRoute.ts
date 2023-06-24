import express from 'express'

import {
  getTotem,
  getTotemById,
  createTotem,
  updateTotem,
  deleteTotem,
  getAllTrancas,
  getAllBicicletas
} from '../controllers/totemController'

const router = express.Router()

/**
 * @swagger
 * /totem:
 *   get:
 *     tags: [Totem]
 *     summary: Retorna todos os totens cadastradas
 *     responses:
 *       200:
 *         description: Retorna um array com todos os totens cadastradas
 */
router.get('/', getTotem)

/**
 * @swagger
 * /totem/{id}:
 *   get:
 *     tags: [Totem]
 *     summary: Retorna um totem pelo ID
 *     parameters:
 *      - $ref: '#/components/parameters/idTotem'
 *     responses:
 *       200:
 *         description: Retorna um totem pelo ID
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Totem não encontrada
 */
router.get('/:id', getTotemById)

/**
 * @swagger
 * /totem:
 *   post:
 *     tags: [Totem]
 *     summary: Cria um totem
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewTotem'
 *     responses:
 *       201:
 *         description: Retorna o totem criada
 *       400:
 *         description: Erro de validação
 */
router.post('/', createTotem)

/**
 * @swagger
 * /totem/{id}:
 *   put:
 *     tags: [Totem]
 *     summary: Atualiza um totem pelo ID
 *     parameters:
 *       - $ref: '#/components/parameters/idTotem'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewTotem'
 *     responses:
 *       200:
 *         description: Retorna o totem atualizada
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Totem não encontrada
 */
router.put('/:id', updateTotem)

/**
 * @swagger
 * /totem/{id}:
 *   delete:
 *     tags: [Totem]
 *     summary: Deleta um totem pelo ID
 *     parameters:
 *       - $ref: '#/components/parameters/idTotem'
 *     responses:
 *       200:
 *         description: Dados removidos com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Totem não encontrada
 */
router.delete('/:id', deleteTotem)

/**
 * @swagger
 * /totem/{id}/trancas:
 *   get:
 *     tags: [Totem]
 *     summary: Listar trancas de um totem
 *     parameters:
 *      - $ref: '#/components/parameters/idTotem'
 *     responses:
 *       200:
 *         description: Retorna um array com todos as bicicletas de um totem
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Totem não encontrada
 */
router.get('/:id/trancas', getAllTrancas)

/**
 * @swagger
 * /totem/{id}/bicicletas:
 *   get:
 *     tags: [Totem]
 *     summary: Listar bicicletas de um totem
 *     parameters:
 *      - $ref: '#/components/parameters/idTotem'
 *     responses:
 *       200:
 *         description: Retorna um array com todos as bicicletas de um totem
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Totem não encontrada
 */
router.get('/:id/bicicletas', getAllBicicletas)

export default router
