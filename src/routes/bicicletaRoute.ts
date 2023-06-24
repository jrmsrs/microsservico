import express from 'express'
import {
  getBicicleta,
  getBicicletaById,
  createBicicleta,
  updateBicicleta,
  deleteBicicleta,
  integrarNaRede,
  retirarDaRede
} from '../controllers/bicicletaController'

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
router.get('/', getBicicleta)

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
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Bicicleta não encontrada
 */
router.get('/:id', getBicicletaById)

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
 *       400:
 *         description: Erro de validação
 */
router.post('/', createBicicleta)

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
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Bicicleta não encontrada
 */
router.put('/:id', updateBicicleta)

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
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Bicicleta não encontrada
 */
router.delete('/:id', deleteBicicleta)

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
 *         description: Dados Inválidos (ex status inválido da bicicleta ou tranca)
 */
router.post('/integrarNaRede', integrarNaRede)

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
 *         description: Dados Inválidos (ex status inválido da bicicleta ou tranca)
 */
router.post('/retirarDaRede', retirarDaRede)

export default router