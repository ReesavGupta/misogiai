// src/controllers/thread.controller.ts
import { type Request, type Response } from 'express'
import prisma from '../../prisma/client'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import asyncHandler from '../utils/asyncHandler'

/** 1. Create Thread */
export const createThreadHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, tags, segments } = req.body
    const userId = req.user?.id

    if (
      !title ||
      !segments ||
      !Array.isArray(segments) ||
      segments.length === 0
    ) {
      throw new ApiError(400, 'Title and at least one segment are required')
    }

    const thread = await prisma.thread.create({
      data: {
        title,
        tags,
        author_id: userId!,
        is_published: false,
        segments: {
          create: segments.map((content: string, index: number) => ({
            content,
            order_index: index,
          })),
        },
      },
      include: {
        segments: true,
      },
    })

    res.status(201).json(ApiResponse.success({ thread }))
  }
)

/** 2. Get Thread By ID */
export const getThreadByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id) {
      throw new ApiError(400, 'Thread ID is required')
    }

    const thread = await prisma.thread.findUnique({
      where: { id },
      include: {
        segments: {
          orderBy: { order_index: 'asc' },
        },
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!thread) {
      throw new ApiError(404, 'Thread not found')
    }

    if (!thread.is_published && thread.author_id !== req.user?.id) {
      throw new ApiError(
        403,
        'You are not authorized to view this draft thread'
      )
    }

    res.status(200).json(ApiResponse.success({ thread }))
  }
)

/** 3. Update Thread */
export const updateThreadHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const { title, segments } = req.body
    const userId = req.user?.id

    if (!id) {
      throw new ApiError(400, 'Thread ID is required')
    }

    const existingThread = await prisma.thread.findUnique({ where: { id } })
    if (!existingThread) {
      throw new ApiError(404, 'Thread not found')
    }
    if (existingThread.author_id !== userId) {
      throw new ApiError(403, 'You are not allowed to edit this thread')
    }
    if (existingThread.is_published) {
      throw new ApiError(400, 'Cannot edit a published thread')
    }

    const updatedThread = await prisma.thread.update({
      where: { id },
      data: {
        title: title || existingThread.title,
        segments: {
          // deleteMany: {}, // remove all old segments
          create: (segments || []).map((content: string, index: number) => ({
            content,
            order_index: index,
          })),
        },
      },
      include: { segments: true },
    })

    res.status(200).json(ApiResponse.success({ thread: updatedThread }))
  }
)

/** 4. Publish Thread */
export const publishThreadHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const userId = req.user?.id

    if (!id) {
      throw new ApiError(400, 'Thread ID is required')
    }

    const existingThread = await prisma.thread.findUnique({ where: { id } })
    if (!existingThread) {
      throw new ApiError(404, 'Thread not found')
    }
    if (existingThread.author_id !== userId) {
      throw new ApiError(403, 'You are not allowed to publish this thread')
    }
    if (existingThread.is_published) {
      throw new ApiError(400, 'Thread already published')
    }

    const publishedThread = await prisma.thread.update({
      where: { id },
      data: { is_published: true, created_at: new Date() },
    })

    res.status(200).json(ApiResponse.success({ thread: publishedThread }))
  }
)

/** 5. Delete Thread */
export const deleteThreadHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const userId = req.user?.id

    if (!id) {
      throw new ApiError(400, 'Thread ID is required')
    }

    const existingThread = await prisma.thread.findUnique({ where: { id } })
    if (!existingThread) {
      throw new ApiError(404, 'Thread not found')
    }
    if (existingThread.author_id !== userId) {
      throw new ApiError(403, 'You are not allowed to delete this thread')
    }

    await prisma.thread.delete({ where: { id: id } })

    res
      .status(200)
      .json(ApiResponse.success({ message: 'Thread deleted successfully' }))
  }
)

export const remixThreadHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { originalThreadId, title, tags, segments } = req.body
    const userId = req.user?.id

    if (
      !originalThreadId ||
      !title ||
      !segments ||
      !Array.isArray(segments) ||
      segments.length === 0
    ) {
      throw new ApiError(
        400,
        'Original thread ID, title, and at least one segment are required'
      )
    }

    // Find the original thread to remix
    const originalThread = await prisma.thread.findUnique({
      where: { id: originalThreadId },
      include: { segments: true },
    })

    if (!originalThread) {
      throw new ApiError(404, 'Original thread not found')
    }

    // Create the new remix thread
    const newThread = await prisma.thread.create({
      data: {
        title,
        tags,
        author_id: userId!, // Using the authenticated user's ID
        is_published: false, // You can change this if the user wants to publish immediately
        remix_of_thread_id: originalThreadId, // Link to the original thread
        segments: {
          create: segments.map((content: string, index: number) => ({
            content,
            order_index: index,
          })),
        },
      },
      include: { segments: true },
    })

    // Optionally, you can add reactions, bookmarks, etc., based on the remix logic if needed

    res.status(201).json(ApiResponse.success({ thread: newThread }))
  }
)
