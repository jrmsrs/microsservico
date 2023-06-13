import express from 'express'

import {
  getTranca,
  getTrancaById,
  createTranca,
  updateTranca,
  deleteTranca
} from '../controllers/trancaController'

const router = express.Router()

router.get('/', getTranca)
router.get('/:id', getTrancaById)
router.post('/', createTranca)
router.put('/:id', updateTranca)
router.delete('/:id', deleteTranca)

export default router
