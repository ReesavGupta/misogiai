import { Router, type Request, type Response } from 'express'
import asyncHandler from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import prisma from '../../prisma/client'
import {
  comparePasswords,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
} from '../utils/auth'
import jwt from 'jsonwebtoken'

const router = Router()

router.post(
  '/signup',
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      throw new ApiError(400, 'Email, name and password are required')
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) throw new ApiError(400, 'Email already exists')

    const password_hash = await hashPassword(password)

    const user = await prisma.user.create({
      data: { email, name, password_hash },
    })

    const payload = { userId: user.id }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token: refreshToken,
      },
    })

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      .json(
        ApiResponse.success({
          accessToken,
          user: { id: user.id, name: user.name, email: user.email },
        })
      )
  })
)

router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
      throw new ApiError(400, 'Email, name and password are required')
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new ApiError(401, 'Invalid email or password')
    }

    const valid = await comparePasswords(password, user.password_hash)
    if (!valid) throw new ApiError(401, 'Invalid credentials')

    const payload = { userId: user.id }

    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token: refreshToken,
      },
    })

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json(
        ApiResponse.success({
          accessToken,
          user: { id: user.id, name: user.name, email: user.email },
        })
      )
  })
)

router.post(
  '/refresh-token',
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) throw new ApiError(401, 'No refresh token provided')

    const storedRefreshToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    })
    if (!storedRefreshToken) throw new ApiError(401, 'Invalid refresh token')

    try {
      // Verify the refresh token and generate a new access token
      const decoded: any = jwt.verify(refreshToken, process.env.JWT_SECRET!)
      const payload = { userId: decoded.userId }

      const accessToken = generateAccessToken(payload)

      res.json(ApiResponse.success({ accessToken })) // now we respondd with new access token
    } catch (error) {
      throw new ApiError(401, 'Invalid refresh token')
    }
  })
)

export default router
