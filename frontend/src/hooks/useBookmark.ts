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
  const { isLoading: isCheckingBookmark } = useQuery({
    queryKey: ['bookmark', threadId],
    queryFn: () => bookmarkService.checkBookmark(threadId),
    enabled: !!user,
    onSuccess: (data) => {
      setIsBookmarked(data.isBookmarked)
    },
    onError: () => {
      setIsBookmarked(false)
    },
  })

  // Toggle bookmark mutation
  const { mutate, isLoading: isToggling } = useMutation({
    mutationFn: () =>
      isBookmarked
        ? bookmarkService.removeBookmark(threadId)
        : bookmarkService.addBookmark(threadId),
    onSuccess: () => {
      setIsBookmarked(!isBookmarked)

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['bookmark', threadId] })
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      queryClient.invalidateQueries({ queryKey: ['collections'] })

      toast.success(
        isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
        {
          autoClose: 2000,
        }
      )
    },
    onError: () => {
      toast.error('Failed to update bookmark', {
        autoClose: 3000,
      })
    },
  })

  return {
    isBookmarked,
    toggleBookmark: mutate,
    isLoading: isCheckingBookmark || isToggling,
  }
}
