import { type Request, type Response } from 'express'
import prisma from '../../prisma/client' // adjust path if needed
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'

// Create a new comment
export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { threadId, content } = req.body
    const userId = req.user?.id // Assuming you have user in request after auth

    if (!threadId || !content) {
      throw new ApiError(400, 'Thread ID and content are required')
    }

    const comment = await prisma.comment.create({
      data: {
        thread_id: threadId,
        user_id: userId!,
        content,
      },
    })

    res.status(201).json(ApiResponse.success(comment))
  } catch (error) {
    ApiError.handle(error, res)
  }
}

// Update an existing comment
export const updateComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { commentId } = req.params
    const { content } = req.body
    const userId = req.user?.id

    if (!content) {
      throw new ApiError(400, 'Content is required')
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!existingComment) {
      throw new ApiError(404, 'Comment not found')
    }

    if (existingComment.user_id !== userId) {
      throw new ApiError(403, 'Unauthorized to update this comment')
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    })

    res.status(200).json(ApiResponse.success(updatedComment))
  } catch (error) {
    ApiError.handle(error, res)
  }
}

// Delete a comment
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { commentId } = req.params
    const userId = req.user?.id

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!existingComment) {
      throw new ApiError(404, 'Comment not found')
    }

    if (existingComment.user_id !== userId!) {
      throw new ApiError(403, 'Unauthorized to delete this comment')
    }

    await prisma.comment.delete({
      where: { id: commentId },
    })

    res
      .status(200)
      .json(ApiResponse.success({ message: 'Comment deleted successfully' }))
  } catch (error) {
    ApiError.handle(error, res)
  }
}

// Get all comments for a thread
export const getCommentsForThread = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { threadId } = req.params

    const comments = await prisma.comment.findMany({
      where: { thread_id: threadId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { created_at: 'asc' },
    })

    res.status(200).json(ApiResponse.success(comments))
  } catch (error) {
    ApiError.handle(error, res)
  }
}
