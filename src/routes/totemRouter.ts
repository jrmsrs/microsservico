import express from 'express'

import {
  getTotem,
  getTotemById,
  createTotem,
  updateTotem,
  deleteTotem
} from '../controllers/totemController'

const router = express.Router()

router.get('/', getTotem)
router.get('/:id', getTotemById)
router.post('/', createTotem)
router.put('/:id', updateTotem)
router.delete('/:id', deleteTotem)

export default router
