import express from 'express'
import {
  getBicicleta,
  getBicicletaById,
  createBicicleta,
  updateBicicleta,
  deleteBicicleta
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
 *       404:
 *         description: Nenhuma bicicleta encontrada
 *       500:
 *         description: Erro interno
 */
router.get('/', getBicicleta)

/**
 * @swagger
 * /bicicleta/{id}:
 *   get:
 *     tags: [Bicicleta]
 *     summary: Retorna uma bicicleta pelo ID
 *     parameters:
 *      - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: Retorna uma bicicleta pelo ID
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Bicicleta não encontrada
 *       500:
 *         description: Erro interno
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
 *             $ref: '#/definitions/NewBicicleta'
 *     responses:
 *       201:
 *         description: Retorna a bicicleta criada
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro interno
 */
router.post('/', createBicicleta)

/**
 * @swagger
 * /bicicleta/{id}:
 *   put:
 *     tags: [Bicicleta]
 *     summary: Atualiza uma bicicleta pelo ID
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/NewBicicleta'
 *     responses:
 *       200:
 *         description: Retorna a bicicleta atualizada
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Bicicleta não encontrada
 *       500:
 *         description: Erro interno
 */
router.put('/:id', updateBicicleta)

/**
 * @swagger
 * /bicicleta/{id}:
 *   delete:
 *     tags: [Bicicleta]
 *     summary: Deleta uma bicicleta pelo ID
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: Retorna a bicicleta deletada
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Bicicleta não encontrada
 *       500:
 *         description: Erro interno
 */
router.delete('/:id', deleteBicicleta)

/**
 * @swagger
 * definitions:
 *   NewBicicleta:
 *     required:
 *       - modelo
 *       - marca
 *       - ano
 *       - numero
 *     properties:
 *       modelo:
 *         type: string
 *       marca:
 *         type: string
 *       ano:
 *         type: string
 *         default: 2023
 *       numero:
 *         type: integer
 *       status:
 *         type: string
 *         default: disponivel
 *   Bicicleta:
 *     allOf:
 *       - $ref: '#/definitions/NewBicicleta'
 *     required:
 *       - id
 *     properties:
 *       id:
 *         type: string
 *         format: uuid
 *         example: a2f43e3b-f0f6-40fd-a6a7-dea545076333
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     id:
 *       in: path
 *       name: id
 *       schema:
 *         type: string
 *         format: uuid
 *         default: a2f43e3b-f0f6-40fd-a6a7-dea545076333
 *       description: ID da bicicleta
 *       required: true
 */

export default router
