import { Router, type Request } from 'express'
import userRouter from './user.router'
import authRouter from './auth.router'
import threadRoutes from './thread.router'
import feedRoutes from './feed.router'
import myThreadsRoutes from './myThread.router'
import reactionRoutes from './reaction.router'
import collectionRoutes from './collection.routes'

const router = Router()

router.use('/users', userRouter)
router.use('/auth', authRouter)

// Mounting
router.use('/threads', threadRoutes)
router.use('/feed', feedRoutes)
router.use('/my-threads', myThreadsRoutes)
router.use('/reactions', reactionRoutes)
router.use('/collections', collectionRoutes)

export default router
