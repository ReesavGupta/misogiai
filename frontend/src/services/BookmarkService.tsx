import { api } from '../lib/api'

export const bookmarkService = {
  async addBookmark(threadId: string, collectionId?: string): Promise<void> {
    await api.post(`/bookmarks/threads/${threadId}`, {
      collection_id: collectionId,
    })
  },

  async removeBookmark(threadId: string): Promise<void> {
    await api.delete(`/bookmarks/threads/${threadId}`)
  },

  async checkBookmark(threadId: string): Promise<{ isBookmarked: boolean }> {
    try {
      await api.get(`/bookmarks/check/${threadId}`)
      return { isBookmarked: true }
    } catch (error) {
      return { isBookmarked: false }
    }
  },

  async getMyBookmarks(): Promise<any[]> {
    const response = await api.get('/bookmarks')
    return response.data
  },
}
