import { api } from '../lib/api'
import type { Comment } from '../types'

export const commentService = {
  async addComment(threadId: string, content: string): Promise<Comment> {
    const response = await api.post('/comments', {
      thread_id: threadId,
      content,
    })
    return response.data
  },

  async updateComment(commentId: string, content: string): Promise<Comment> {
    const response = await api.put(`/comments/${commentId}`, {
      content,
    })
    return response.data
  },

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`)
  },

  async getCommentsForThread(threadId: string): Promise<Comment[]> {
    const response = await api.get(`/thread/${threadId}/comments`)
    return response.data
  },
}
