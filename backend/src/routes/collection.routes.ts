import { Router } from 'express'
import {
  createCollection,
  getMyCollections,
  addThreadToCollection,
  removeThreadFromCollection,
} from '../controllers/collection.controller'
import protect from '../middlewares/auth.middleware'

const router = Router()

// Create a collection
router.post('/collections', protect, createCollection)

// Get my collections
router.get('/collections', protect, getMyCollections)

// Add a thread to a collection (bookmark)
router.post('/threads/:threadId/bookmarks', protect, addThreadToCollection)

// Remove a thread from a collection (unbookmark)
router.delete(
  '/threads/:threadId/bookmarks',
  protect,
  removeThreadFromCollection
)

export default router
