import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../../prisma/client'
import { ApiError } from '../utils/ApiError'

// Middleware to verify access token and attach user to req.user
const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return next(new ApiError(401, 'No token provided'))
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })
    if (!user) {
      return next(new ApiError(401, 'User not found'))
    }

    // Attach user to the request object
    req.user = user
    next()
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired token'))
  }
}

export default authenticateToken
