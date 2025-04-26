'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reactionService } from '../services/ReactionService'
import type { ReactionType } from '../types/index'
import { toast } from 'react-toastify'

export function useReaction(threadId: string) {
  const queryClient = useQueryClient()

  const addReactionMutation = useMutation({
    mutationFn: (emoji: ReactionType) =>
      reactionService.addReaction(threadId, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thread', threadId] })
      queryClient.invalidateQueries({ queryKey: ['threads'] })
    },
    onError: () => {
      toast.error('Failed to add reaction', {
        autoClose: 3000,
      })
    },
  })

  const removeReactionMutation = useMutation({
    mutationFn: () => reactionService.removeReaction(threadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thread', threadId] })
      queryClient.invalidateQueries({ queryKey: ['threads'] })
    },
    onError: () => {
      toast.error('Failed to remove reaction', {
        autoClose: 3000,
      })
    },
  })

  return {
    addReaction: addReactionMutation.mutate,
    removeReaction: removeReactionMutation.mutate,
    isLoading:
      addReactionMutation.isLoading || removeReactionMutation.isLoading,
  }
}
