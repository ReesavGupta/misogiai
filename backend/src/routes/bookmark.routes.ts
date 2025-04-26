import { Router } from 'express'
import {
  addBookmark,
  removeBookmark,
  checkBookmark,
  getMyBookmarks,
} from '../controllers/bookmark.controller'
import protect from '../middlewares/auth.middleware' // adjust path if needed

const router = Router()

// Protected Routes
router.post('/threads/:threadId', protect, addBookmark)
router.delete('/threads/:threadId', protect, removeBookmark)
router.get('/check/:threadId', protect, checkBookmark)
router.get('/bookmarks', protect, getMyBookmarks)

export default router
