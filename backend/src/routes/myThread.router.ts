import express from 'express'
import {
  getMyDrafts,
  getMyPublishedThreads,
} from '../controllers/myThread.controller'
import protect from '../middlewares/auth.middleware'

const router = express.Router()

// Protected Routes (needs login)
router.get('/drafts', protect, getMyDrafts)
router.get('/published', protect, getMyPublishedThreads)

export default router
