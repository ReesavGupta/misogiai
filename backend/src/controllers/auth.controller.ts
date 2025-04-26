import type { Request, Response } from 'express'
import prisma from '../../prisma/client'
import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import asyncHandler from '../utils/asyncHandler'
import {
  comparePasswords,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
} from '../utils/auth'

export const signupHandler = asyncHandler(
  async (req: Request, res: Response) => {
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
  }
)

export const loginHandler = asyncHandler(
  async (req: Request, res: Response) => {
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
  }
)

export const logoutHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) throw new ApiError(400, 'Refresh token not found')

    // Delete the refresh token from the database
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    })

    // Clear the cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    res.json(ApiResponse.success({ message: 'Logged out successfully' }))
  }
)
export const refreshTokenHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies.refreshToken
    if (!oldRefreshToken) throw new ApiError(401, 'No refresh token provided')

    const storedToken = await prisma.refreshToken.findFirst({
      where: { token: oldRefreshToken },
    })

    if (!storedToken) throw new ApiError(401, 'Invalid refresh token')

    try {
      // Use REFRESH_TOKEN_SECRET instead of JWT_SECRET
      const decoded: any = jwt.verify(
        oldRefreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      )
      const payload = { userId: decoded.userId }

      // Delete only the specific token used
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      })

      // Generate new tokens
      const newAccessToken = generateAccessToken(payload)
      const newRefreshToken = generateRefreshToken(payload)

      // Save new refresh token
      await prisma.refreshToken.create({
        data: {
          user_id: decoded.userId,
          token: newRefreshToken,
        },
      })

      // Set the new refresh token cookie
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.json(ApiResponse.success({ accessToken: newAccessToken }))
    } catch (error) {
      console.error('JWT verification error:', error)
      throw new ApiError(401, 'Invalid refresh token')
    }
  }
)
