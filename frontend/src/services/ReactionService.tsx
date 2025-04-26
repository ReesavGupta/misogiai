import { api } from '../lib/api'
import type { ReactionType } from '../types'

export const reactionService = {
  async addReaction(threadId: string, emoji: ReactionType): Promise<void> {
    await api.post(`/threads/${threadId}/reactions`, {
      emoji,
    })
  },

  async removeReaction(threadId: string): Promise<void> {
    await api.delete(`/threads/${threadId}/reactions`)
  },

  async getReactionsForThread(threadId: string): Promise<any[]> {
    const response = await api.get(`/threads/${threadId}/reactions`)
    return response.data
  },
}
