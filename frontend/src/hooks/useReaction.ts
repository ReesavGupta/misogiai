'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reactionService } from '../services/ReactionService'
import { useToast } from '@/components/ui/use-toast'
import type { ReactionType } from '../types/index'

export function useReaction(threadId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const addReactionMutation = useMutation({
    mutationFn: (emoji: ReactionType) =>
      reactionService.addReaction(threadId, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thread', threadId] })
      queryClient.invalidateQueries({ queryKey: ['threads'] })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add reaction',
        variant: 'destructive',
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
      toast({
        title: 'Error',
        description: 'Failed to remove reaction',
        variant: 'destructive',
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
