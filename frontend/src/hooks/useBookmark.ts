'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookmarkService } from '../services/BookmarkService'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

export function useBookmark(threadId: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Check if thread is bookmarked
  const { isPending: isCheckingBookmark, error } = useQuery({
    queryKey: ['bookmark', threadId],
    queryFn: async () => {
      try {
        const data = await bookmarkService.checkBookmark(threadId)
        setIsBookmarked(data.isBookmarked)
        return data
      } catch (err) {
        setIsBookmarked(false)
        toast.error('Failed to check bookmark', { autoClose: 3000 })
        throw err
      }
    },
    enabled: !!user,
  })

  // Toggle bookmark mutation
  const { mutate, isPending: isToggling } = useMutation({
    mutationFn: async () => {
      try {
        return isBookmarked
          ? await bookmarkService.removeBookmark(threadId)
          : await bookmarkService.addBookmark(threadId)
      } catch (err) {
        toast.error('Failed to update bookmark', { autoClose: 3000 })
        throw err
      }
    },
    onSuccess: () => {
      setIsBookmarked(!isBookmarked)

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['bookmark', threadId] })
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      queryClient.invalidateQueries({ queryKey: ['collections'] })

      toast.success(
        isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
        {
          autoClose: 3000,
        }
      )
    },
  })

  return {
    isBookmarked,
    toggleBookmark: mutate,
    isLoading: isCheckingBookmark || isToggling,
    error, // Include error for debugging
  }
}
