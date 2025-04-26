import { api } from '../lib/api'
import type { Thread, ThreadFilters } from '../types'

export const threadService = {
  async getThreads(filters: ThreadFilters): Promise<Thread[]> {
    const { sort = 'newest', search = '', tags = [] } = filters

    const params = new URLSearchParams()
    params.append('sort', sort)

    if (search) {
      params.append('search', search)
    }

    if (tags.length > 0) {
      tags.forEach((tag) => params.append('tags', tag))
    }

    const response = await api.get(`/feed?${params.toString()}`)
    return response.data
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

  async getMyThreads(type: 'published' | 'drafts'): Promise<Thread[]> {
    const response = await api.get(`/my-threads?type=${type}`)
    return response.data
  },

  async getPopularTags(): Promise<string[]> {
    const response = await api.get('/tags/popular')
    return response.data
  },
}
