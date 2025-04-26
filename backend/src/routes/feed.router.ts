import express from 'express'
import {
  getLatestThreads,
  getThreadsByTag,
} from '../controllers/feed.controller'

const router = express.Router()

// Public Routes
router.get('/', getLatestThreads)
router.get('/tag/:tag', getThreadsByTag)

export default router
