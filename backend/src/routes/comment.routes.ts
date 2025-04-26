import { Router } from 'express'
import {
  createComment,
  getCommentsForThread,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller' // Adjust the import path as needed
import protect from '../middlewares/auth.middleware' // Assuming you have one

const router = Router()

// Public: Get comments for a thread
router.get('/thread/:threadId', getCommentsForThread)

// Protected: Create a comment
router.post('/', protect, createComment)

// Protected: Update a comment
router.put('/:commentId', protect, updateComment)

// Protected: Delete a comment
router.delete('/:commentId', protect, deleteComment)

export default router
