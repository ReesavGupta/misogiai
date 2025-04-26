import { api } from '../lib/api'

import type { Collection } from '../types'

export const collectionService = {
  async createCollection(name: string, isPrivate: boolean): Promise<string> {
    const response = await api.post('/collections', {
      name,
      is_private: isPrivate,
    })
    return response.data.id
  },

  async updateCollection(
    id: string,
    name: string,
    isPrivate: boolean
  ): Promise<void> {
    await api.patch(`/collections/${id}`, {
      name,
      is_private: isPrivate,
    })
  },

  async deleteCollection(id: string): Promise<void> {
    await api.delete(`/collections/${id}`)
  },

  async getMyCollections(): Promise<Collection[]> {
    const response = await api.get('/collections')
    return response.data
  },

  async getCollectionById(id: string): Promise<Collection> {
    const response = await api.get(`/collections/${id}`)
    return response.data
  },

  async addThreadToCollection(
    threadId: string,
    collectionId: string
  ): Promise<void> {
    await api.post(`/threads/${threadId}/bookmarks`, {
      collection_id: collectionId,
    })
  },

  async removeThreadFromCollection(
    threadId: string,
    collectionId: string
  ): Promise<void> {
    await api.delete(`/threads/${threadId}/bookmarks`, {
      data: { collection_id: collectionId },
    })
  },
}
