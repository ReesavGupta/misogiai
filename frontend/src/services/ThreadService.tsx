import { api } from '../lib/api'
import type { Thread, ThreadFilters } from '../types'

export const threadService = {
  async getThreads(filters: ThreadFilters): Promise<Thread[]> {
    const { sort = 'newest', tags = [] } = filters

    let url = '/feed'

    if (tags.length === 1) {
      url = `/feed/tag/${encodeURIComponent(tags[0])}`
    }
    console.log(url)
    const response = await api.get(url)
    console.log(`my url :`, response.data.data.threads)
    return response.data.data.threads
  },
  async getThreadById(id: string): Promise<Thread> {
    const response = await api.get(`/threads/${id}`)
    return response.data
  },

  async createThread(
    thread: Partial<Thread>,
    publish: boolean
  ): Promise<string> {
    const response = await api.post('/threads', {
      ...thread,
      is_published: publish,
    })
    return response.data.id
  },

  async updateThread(
    id: string,
    thread: Partial<Thread>,
    publish: boolean
  ): Promise<void> {
    await api.patch(`/threads/${id}`, {
      ...thread,
      is_published: publish,
    })
  },

  async deleteThread(id: string): Promise<void> {
    await api.delete(`/threads/${id}`)
  },

  async publishThread(id: string): Promise<void> {
    await api.patch(`/threads/${id}/publish`)
  },

  async remixThread(id: string): Promise<string> {
    const response = await api.post(`/threads/${id}/remix`)
    return response.data.id
  },

  async getPopularTags(): Promise<string[]> {
    const response = await api.get('/feed')
    return response.data.data.threads
  },
}
