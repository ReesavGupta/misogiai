import { type Request, type Response } from 'express'
import prisma from '../../prisma/client'
import { ApiResponse } from '../utils/ApiResponse'

export const addThreadToCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id
    const { threadId } = req.params
    const { collectionId } = req.body

    const existingBookmark = await prisma.bookmark.findFirst({
      where: { user_id: userId, thread_id: threadId },
    })

    if (existingBookmark) {
      res
        .status(400)
        .json(
          new ApiResponse(
            false,
            400,
            null,
            'Already bookmarked',
            'Already bookmarked'
          )
        )
      return
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        user_id: userId!,
        thread_id: threadId,
        collection_id: collectionId || null,
      },
    })

    res.status(201).json(ApiResponse.success(bookmark))
  } catch (error) {
    console.error(error)
    res.status(500).json(ApiResponse.error('Failed to bookmark thread'))
  }
}

export const removeThreadFromCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id
    const { threadId } = req.params

    const bookmark = await prisma.bookmark.findFirst({
      where: { user_id: userId!, thread_id: threadId },
    })

    if (!bookmark) {
      res
        .status(404)
        .json(
          new ApiResponse(
            false,
            404,
            null,
            'Bookmark not found',
            'Bookmark not found'
          )
        )
      return
    }

    await prisma.bookmark.delete({
      where: { id: bookmark.id },
    })

    res
      .status(200)
      .json(ApiResponse.success({ message: 'Bookmark removed successfully' }))
  } catch (error) {
    console.error(error)
    res.status(500).json(ApiResponse.error('Failed to remove bookmark'))
  }
}
