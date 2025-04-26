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
  console.log('Request header:', req.header('Authorization'))
  const token = req.header('Authorization')?.split(' ')[1]
  console.log(`Token from header: ${token}`)
  if (!token) {
    return next(new ApiError(401, 'No token provided'))
  }

  try {
    console.log(`hello from auth middleware`)
    const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
    console.log('Decoded token:', decoded)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })
    if (!user) {
      return next(new ApiError(401, 'User not found'))
    }

    // Attach user to the request object
    req.user = user
    console.log(`inside protect middleware`)
    next()
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired token'))
  }
}

export default authenticateToken
