import { api } from '../lib/api'
import type { ReactionType } from '../types'

export const reactionService = {
  async addReaction(threadId: string, emoji: ReactionType): Promise<void> {
    await api.post(`/reactions/${threadId}`, {
      emoji,
    })
  },

  async removeReaction(threadId: string): Promise<void> {
    await api.delete(`/reactions/${threadId}`)
  },

  async getReactionsForThread(threadId: string): Promise<any[]> {
    const response = await api.get(`/reactions/${threadId}`)
    return response.data
  },
}
