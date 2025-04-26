import { Router, type Request } from 'express'
import userRouter from './user.router'
import authRouter from './auth.router'
import threadRoutes from './thread.router'
import feedRoutes from './feed.router'
import myThreadsRoutes from './myThread.router'
const router = Router()

router.use('/users', userRouter)
router.use('/auth', authRouter)

// Mounting
router.use('/threads', threadRoutes)
router.use('/feed', feedRoutes)
router.use('/my-threads', myThreadsRoutes)

export default router
