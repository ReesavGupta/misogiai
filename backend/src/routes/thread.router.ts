// src/routes/thread.routes.ts
import express from 'express'
import {
  createThreadHandler,
  getThreadByIdHandler,
  updateThreadHandler,
  publishThreadHandler,
  deleteThreadHandler,
} from '../controllers/thread.controller'
import protect from '../middlewares/auth.middleware'

const router = express.Router()

router.get('/:id', getThreadByIdHandler)

//protected routes
router.post('/', protect, createThreadHandler)
router.patch('/:id', protect, updateThreadHandler)
router.patch('/:id/publish', protect, publishThreadHandler)
router.delete('/:id', protect, deleteThreadHandler)

export default router
