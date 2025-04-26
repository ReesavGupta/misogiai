// src/controllers/mythreads.controller.ts
import { type Request, type Response } from 'express'
import prisma from '../../prisma/client'
import { ApiResponse } from '../utils/ApiResponse'
import asyncHandler from '../utils/asyncHandler'

/** Get My Draft Threads */
export const getMyDrafts = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id

  const drafts = await prisma.thread.findMany({
    where: {
      author_id: userId,
      is_published: false,
    },
    include: {
      segments: true,
    },
    orderBy: { created_at: 'desc' },
  })

  res.status(200).json(ApiResponse.success({ drafts }))
})

/** Get My Published Threads */
export const getMyPublishedThreads = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id

    const threads = await prisma.thread.findMany({
      where: {
        author_id: userId,
        is_published: true,
      },
      include: {
        segments: true,
      },
      orderBy: { created_at: 'desc' },
    })

    res.status(200).json(ApiResponse.success({ threads }))
  }
)
