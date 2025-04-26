import { type Request, type Response } from 'express'
import prisma from '../../prisma/client'
import { ApiError } from '../utils/ApiError'

// Add a reaction to a thread
export const addReaction = async (req: Request, res: Response) => {
  try {
    const { threadId } = req.params
    const { emoji } = req.body
    const userId = req.user?.id

    if (!emoji) throw new ApiError(400, 'Emoji is required.')

    const thread = await prisma.thread.findUnique({ where: { id: threadId } })
    if (!thread || !thread.is_published) {
      throw new ApiError(404, 'Thread not found or not published.')
    }

    const reaction = await prisma.reaction.upsert({
      where: { user_id_thread_id: { user_id: userId!, thread_id: threadId } },
      update: { emoji },
      create: { user_id: userId!, thread_id: threadId, emoji },
    })

    res.status(201).json({ reaction })
  } catch (err) {
    ApiError.handle(err, res)
  }
}

// Remove reaction
export const removeReaction = async (req: Request, res: Response) => {
  try {
    const { threadId } = req.params
    const userId = req.user?.id

    await prisma.reaction.delete({
      where: {
        user_id_thread_id: {
          user_id: userId!,
          thread_id: threadId,
        },
      },
    })

    res.status(204).send()
  } catch (err) {
    ApiError.handle(err, res)
  }
}

// Get reactions for a thread
export const getReactionsForThread = async (req: Request, res: Response) => {
  try {
    const { threadId } = req.params

    const reactions = await prisma.reaction.findMany({
      where: { thread_id: threadId },
      select: { emoji: true, user_id: true },
    })

    res.json({ reactions })
  } catch (err) {
    ApiError.handle(err, res)
  }
}
