import { Router } from 'express'
import {
  addReaction,
  removeReaction,
  getReactionsForThread,
} from '../controllers/reaction.controller'
import protect from '../middlewares/auth.middleware'

const router = Router()

// protected routes

// Add or update a reaction to a thread
router.post('/:threadId', protect, addReaction)
// Remove my reaction from a thread
router.delete('/:threadId', protect, removeReaction)

// unprotected route
// Get reactions for a thread
router.get('/:threadId', getReactionsForThread)

export default router
