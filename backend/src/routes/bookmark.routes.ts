import { Router } from 'express'
import {
  addThreadToCollection,
  removeThreadFromCollection,
} from '../controllers/bookmark.controller'
import authMiddleware from '../middlewares/auth.middleware'

const router = Router()

// Add a thread to bookmarks (optionally into a collection)
router.post(
  '/threads/:threadId/bookmarks',
  authMiddleware,
  addThreadToCollection
)

// Remove a thread from bookmarks
router.delete(
  '/threads/:threadId/bookmarks',
  authMiddleware,
  removeThreadFromCollection
)

export default router
