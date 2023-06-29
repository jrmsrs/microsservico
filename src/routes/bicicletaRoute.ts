import express from 'express'
import * as controller from '../controllers/bicicletaController'

const router = express.Router()

/**
 * @swagger
 * /bicicleta:
 *   get:
 *     tags: [Bicicleta]
 *     summary: Retorna todas as bicicletas cadastradas
 *     responses:
 *       200:
 *         description: Retorna um array com todas as bicicletas cadastradas
 */
router.get('/', controller.getBicicleta)

/**
 * @swagger
 * /bicicleta/{id}:
 *   get:
 *     tags: [Bicicleta]
 *     summary: Retorna uma bicicleta pelo ID
 *     parameters:
 *      - $ref: '#/components/parameters/idBicicleta'
 *     responses:
 *       200:
 *         description: Retorna uma bicicleta pelo ID
 *       422:
 *         description: Erro de validação
 *       404:
 *         description: Bicicleta não encontrada
 */
router.get('/:id', controller.getBicicletaById)

/**
 * @swagger
 * /bicicleta:
 *   post:
 *     tags: [Bicicleta]
 *     summary: Cria uma bicicleta
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewBicicleta'
 *     responses:
 *       201:
 *         description: Retorna a bicicleta criada
 *       422:
 *         description: Erro de validação
 */
router.post('/', controller.createBicicleta)

/**
 * @swagger
 * /bicicleta/{id}:
 *   put:
 *     tags: [Bicicleta]
 *     summary: Atualiza uma bicicleta pelo ID
 *     parameters:
 *       - $ref: '#/components/parameters/idBicicleta'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewBicicleta'
 *     responses:
 *       200:
 *         description: Retorna a bicicleta atualizada
 *       422:
 *         description: Erro de validação
 *       404:
 *         description: Bicicleta não encontrada
 */
router.put('/:id', controller.updateBicicleta)

/**
 * @swagger
 * /bicicleta/{id}:
 *   delete:
 *     tags: [Bicicleta]
 *     summary: Deleta uma bicicleta pelo ID
 *     parameters:
 *       - $ref: '#/components/parameters/idBicicleta'
 *     responses:
 *       200:
 *         description: Dados removidos com sucesso
 *       422:
 *         description: Erro de validação
 *       404:
 *         description: Bicicleta não encontrada
 */
router.delete('/:id', controller.deleteBicicleta)

/**
 * @swagger
 * /bicicleta/integrarNaRede:
 *   post:
 *     tags: [Bicicleta]
 *     summary: colocar uma bicicleta nova ou retornando de reparo de volta na rede de totens
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IntegrarBicicletaRede'
 *     responses:
 *       200:
 *         description: Dados cadastrados
 *       422:
 *         description: Erro de validação
 *       404:
 *         description: Tranca/Bicicleta/Funcionário não encontrada(o)
 */
router.post('/integrarNaRede', controller.integrarNaRede)

/**
 * @swagger
 * /bicicleta/retirarDaRede:
 *   post:
 *     tags: [Bicicleta]
 *     summary: retirar bicicleta para reparo ou aposentadoria
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RetirarBicicletaRede'
 *     responses:
 *       200:
 *         description: Dados cadastrados
 *       422:
 *         description: Erro de validação
 *       404:
 *         description: Tranca/Bicicleta/Funcionário não encontrada(o)
 */
router.post('/retirarDaRede', controller.retirarDaRede)

/**
 * @swagger
 * /bicicleta/{id}/status/{statusAcao}:
 *   post:
 *     tags: [Bicicleta]
 *     summary: Alterar status da bicicleta.
 *     parameters:
 *      - $ref: '#/components/parameters/idBicicleta'
 *      - $ref: '#/components/parameters/bicicletaStatus'
 *     responses:
 *       200:
 *         description: Status alterado
 *       422:
 *         description: Erro de validação
 *       404:
 *         description: Bicicleta não encontrada
 */
router.post('/:id/status/:statusAcao', controller.setStatus)

export default router
