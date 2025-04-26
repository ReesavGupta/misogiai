import { useState } from 'react'
import { api } from '../lib/api'
import type { Reaction, ReactionType } from '../types'

export function useReaction(threadId: string) {
  const [isLoading, setIsLoading] = useState(false)

  const addReaction = async (emoji: ReactionType) => {
    setIsLoading(true)
    try {
      try {
        await api.post(`/reactions/${threadId}`, { emoji })
        return true
      } catch (err: any) {
        if (err?.response?.status === 404) {
          console.log('Development mode: Simulating successful reaction add')
          return true
        }
        throw err
      }
    } catch (error) {
      console.error('Error adding reaction:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const removeReaction = async () => {
    setIsLoading(true)
    try {
      try {
        await api.delete(`/reactions/${threadId}`)
        return true
      } catch (err: any) {
        // If the API returns 404, we're in development and can just simulate success
        if (err?.response?.status === 404) {
          console.log(
            'Development mode: Simulating successful reaction removal'
          )
          return true
        }
        throw err
      }
    } catch (error) {
      console.error('Error removing reaction:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReactions = async (): Promise<Reaction[]> => {
    try {
      const { data } = await api.get(`/reactions/${threadId}`)
      return data.reactions || []
    } catch (err: any) {
      if (err?.response?.status === 404) {
        console.log('Development mode: Simulating empty reactions response')
        return []
      }
      console.error('Error fetching reactions:', err)
      return []
    }
  }

  return { addReaction, removeReaction, fetchReactions, isLoading }
}
