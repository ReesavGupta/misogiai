import { Router, type Request, type Response } from 'express'

import {
  signupHandler,
  loginHandler,
  logoutHandler,
  refreshTokenHandler,
} from '../controllers/auth.controller'

const router = Router()

router.post('/signup', signupHandler)

router.post('/login', loginHandler)

router.post('/logout', logoutHandler)

router.post('/refresh-token', refreshTokenHandler)

export default router
