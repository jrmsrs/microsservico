import express from 'express'
import {
  getBicicleta,
  getBicicletaById,
  createBicicleta,
  updateBicicleta,
  deleteBicicleta
} from '../controllers/bicicletaController'

const router = express.Router()

router.get('/', getBicicleta)
router.get('/:id', getBicicletaById)
router.post('/', createBicicleta)
router.put('/:id', updateBicicleta)
router.delete('/:id', deleteBicicleta)

export default router
