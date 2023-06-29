import express from 'express'

import * as Controller from '../controllers/totemController'

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
router.get('/', Controller.getTotem)

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
 *       422:
 *         description: Erro de validação
 *       404:
 *         description: Totem não encontrada
 */
router.get('/:id', Controller.getTotemById)

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
 *       422:
 *         description: Erro de validação
 */
router.post('/', Controller.createTotem)

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
 *       422:
 *         description: Erro de validação
 *       404:
 *         description: Totem não encontrada
 */
router.put('/:id', Controller.updateTotem)

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
 *       422:
 *         description: Erro de validação
 *       404:
 *         description: Totem não encontrada
 */
router.delete('/:id', Controller.deleteTotem)

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
 *       422:
 *         description: Erro de validação
 *       404:
 *         description: Totem não encontrada
 */
router.get('/:id/trancas', Controller.getAllTrancas)

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
 *       422:
 *         description: Erro de validação
 *       404:
 *         description: Totem não encontrada
 */
router.get('/:id/bicicletas', Controller.getAllBicicletas)

export default router
