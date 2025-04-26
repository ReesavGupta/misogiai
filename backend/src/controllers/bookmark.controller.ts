import { type Request, type Response } from 'express'
import prisma from '../../prisma/client'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'

// Add thread to bookmarks (and optional collection)
export const addBookmark = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id
    const { threadId } = req.params
    const { collection_id } = req.body

    if (!threadId) {
      throw new ApiError(400, 'Thread ID is required')
    }

    const existingBookmark = await prisma.bookmark.findFirst({
      where: { user_id: userId, thread_id: threadId },
    })

    if (existingBookmark) {
      throw new ApiError(400, 'Already bookmarked')
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        user_id: userId!,
        thread_id: threadId,
        collection_id: collection_id || null,
      },
    })

    res.status(201).json(ApiResponse.success(bookmark))
  } catch (error) {
    ApiError.handle(error, res)
  }
}

// Remove thread from bookmarks
export const removeBookmark = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id
    const { threadId } = req.params

    if (!threadId) {
      throw new ApiError(400, 'Thread ID is required')
    }

    const bookmark = await prisma.bookmark.findFirst({
      where: { user_id: userId, thread_id: threadId },
    })

    if (!bookmark) {
      throw new ApiError(404, 'Bookmark not found')
    }

    await prisma.bookmark.delete({
      where: { id: bookmark.id },
    })

    res
      .status(200)
      .json(ApiResponse.success({ message: 'Bookmark removed successfully' }))
  } catch (error) {
    ApiError.handle(error, res)
  }
}

// Check if thread is bookmarked by user
export const checkBookmark = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id
    const { threadId } = req.params

    if (!threadId) {
      throw new ApiError(400, 'Thread ID is required')
    }

    const bookmark = await prisma.bookmark.findFirst({
      where: { user_id: userId, thread_id: threadId },
    })

    if (!bookmark) {
      throw new ApiError(404, 'Bookmark not found')
    }

    res.status(200).json(ApiResponse.success({ isBookmarked: true }))
  } catch (error) {
    ApiError.handle(error, res)
  }
}

// Get all bookmarks for current user
export const getMyBookmarks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id

    const bookmarks = await prisma.bookmark.findMany({
      where: { user_id: userId },
      include: {
        thread: {
          include: {
            author: {
              select: { id: true, name: true },
            },
          },
        },
        collection: true,
      },
      orderBy: { created_at: 'desc' },
    })

    res.status(200).json(ApiResponse.success(bookmarks))
  } catch (error) {
    ApiError.handle(error, res)
  }
}
