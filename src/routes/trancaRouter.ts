import express from 'express'

import {
  getTranca,
  getTrancaById,
  createTranca,
  updateTranca,
  deleteTranca,
  integrarNaRede,
  retirarDaRede,
  trancar,
  destrancar
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

/**
 * @swagger
 * /tranca/integrarNaRede:
 *   post:
 *     tags: [Tranca]
 *     summary: colocar uma tranca nova ou retornando de reparo de volta na rede de totens
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IntegrarTrancaRede'
 *     responses:
 *       200:
 *         description: Dados cadastrados
 *       422:
 *         description: Dados Inválidos (ex status inválido da bicicleta ou tranca)
 */
router.post('/integrarNaRede', integrarNaRede)

/**
 * @swagger
 * /tranca/retirarDaRede:
 *   post:
 *     tags: [Tranca]
 *     summary: retirar tranca para reparo ou aposentadoria
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RetirarTrancaRede'
 *     responses:
 *       200:
 *         description: Dados cadastrados
 *       422:
 *         description: Dados Inválidos (ex status inválido da bicicleta ou tranca)
 */
router.post('/retirarDaRede', retirarDaRede)

/**
 * @swagger
 * /tranca/{id}/trancar:
 *   post:
 *     tags: [Tranca]
 *     summary: Realiza o trancamento da tranca alterando o status da mesma de acordo. Caso receba o id da bicleta no corpo do post também altera o status da mesma e associa a tranca à bicicleta
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trancar'
 *     parameters:
 *      - $ref: '#/components/parameters/idTranca'
 *     responses:
 *       200:
 *         description: Ação bem sucedida
 *       404:
 *         description: Tranca não encontrada
 *       422:
 *         description: Dados Inválidos ou tranca já se encontra trancada
 */
router.post('/:id/trancar', trancar)

/**
 * @swagger
 * /tranca/{id}/destrancar:
 *   post:
 *     tags: [Tranca]
 *     summary: Realiza o destrancamento da tranca alterando o status da mesma de acordo. Caso receba o id da bicleta no corpo do post também altera o status da mesma e desassocia a tranca à bicicleta.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Destrancar'
 *     parameters:
 *      - $ref: '#/components/parameters/idTranca'
 *     responses:
 *       200:
 *         description: Ação bem sucedida
 *       404:
 *         description: Tranca não encontrada
 *       422:
 *         description: Dados Inválidos
 */
router.post('/:id/destrancar', destrancar)

export default router
