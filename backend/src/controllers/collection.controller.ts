import { type Request, type Response } from 'express'
import prisma from '../../prisma/client'
import { ApiError } from '../utils/ApiError'

// Create a collection
export const createCollection = async (req: Request, res: Response) => {
  try {
    const { name, is_private } = req.body
    const userId = req.user?.id

    if (!name) throw new ApiError(400, 'Collection name is required.')

    const collection = await prisma.collection.create({
      data: {
        name,
        is_private: is_private ?? false,
        user_id: userId!,
      },
    })

    res.status(201).json({ collection })
  } catch (err) {
    ApiError.handle(err, res)
  }
}

// Get my collections
export const getMyCollections = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    const collections = await prisma.collection.findMany({
      where: { user_id: userId },
      include: {
        bookmarks: {
          include: {
            thread: {
              select: {
                id: true,
                title: true,
                tags: true,
                author: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    })

    res.json({ collections })
  } catch (err) {
    ApiError.handle(err, res)
  }
}

// Add thread to a collection (bookmark)
export const addThreadToCollection = async (req: Request, res: Response) => {
  try {
    const { threadId } = req.params
    const { collectionId } = req.body
    const userId = req.user?.id

    const thread = await prisma.thread.findUnique({ where: { id: threadId } })
    if (!thread || !thread.is_published) {
      throw new ApiError(404, 'Thread not found or not published.')
    }

    const bookmark = await prisma.bookmark.upsert({
      where: { user_id_thread_id: { user_id: userId!, thread_id: threadId } },
      update: { collection_id: collectionId },
      create: {
        user_id: userId!,
        thread_id: threadId,
        collection_id: collectionId || null,
      },
    })

    res.status(201).json({ bookmark })
  } catch (err) {
    ApiError.handle(err, res)
  }
}

// Remove thread from a collection (or unbookmark)
export const removeThreadFromCollection = async (
  req: Request,
  res: Response
) => {
  try {
    const { threadId } = req.params
    const userId = req.user?.id

    await prisma.bookmark.delete({
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
