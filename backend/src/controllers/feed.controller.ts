import { type Request, type Response } from 'express'
import prisma from '../../prisma/client'
import { ApiResponse } from '../utils/ApiResponse'
import asyncHandler from '../utils/asyncHandler'

/** Get Latest Threads */
export const getLatestThreads = asyncHandler(
  async (req: Request, res: Response) => {
    const threads = await prisma.thread.findMany({
      where: { is_published: true },
      orderBy: { created_at: 'desc' },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
      take: 20,
    })

    res.status(200).json(ApiResponse.success({ threads }))
  }
)

/** Get Threads by Tag */
export const getThreadsByTag = asyncHandler(
  async (req: Request, res: Response) => {
    const { tag } = req.params

    const threads = await prisma.thread.findMany({
      where: {
        is_published: true,
        tags: { has: tag },
      },
      orderBy: { created_at: 'desc' },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    })

    res.status(200).json(ApiResponse.success({ threads }))
  }
)
