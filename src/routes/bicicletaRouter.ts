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
 *      - $ref: '#/components/parameters/idBicicleta'
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
 *             $ref: '#/components/schemas/NewBicicleta'
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
 *       - $ref: '#/components/parameters/idBicicleta'
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

export default router
