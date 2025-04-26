'use client'

import { useState, useEffect } from 'react'
import {
  Brain,
  Flame,
  PlayIcon as Clap,
  Eye,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '../context/AuthContext'
import { useReaction } from '../hooks/useReaction'
import type { Reaction, ReactionType } from '../types'

interface ReactionButtonsProps {
  threadId: string
  reactions?: Reaction[]
}

const reactionsList: {
  type: ReactionType
  icon: JSX.Element
  label: string
}[] = [
  { type: 'brain', icon: <Brain size={16} />, label: 'Insightful' },
  { type: 'fire', icon: <Flame size={16} />, label: 'Fire' },
  { type: 'clap', icon: <Clap size={16} />, label: 'Applause' },
  { type: 'eyes', icon: <Eye size={16} />, label: 'Interesting' },
  { type: 'warning', icon: <AlertTriangle size={16} />, label: 'Caution' },
]

export default function ReactionButtons({
  threadId,
  reactions = [],
}: ReactionButtonsProps) {
  const { user } = useAuth()
  const { addReaction, removeReaction, isLoading } = useReaction(threadId)

  // Just keep track of local reactions and whether we've applied them or not
  const [localReactions, setLocalReactions] = useState<Reaction[]>([])

  // Initialize local reactions once from props
  useEffect(() => {
    setLocalReactions(reactions)
  }, []) // Empty dependency array - only run once on mount

  const getUserReaction = () => {
    if (!user || !localReactions) return undefined
    return localReactions.find((r) => r.user_id === user.id)?.emoji
  }

  const handleReaction = async (type: ReactionType) => {
    if (!user) return

    const currentUserReaction = getUserReaction()

    try {
      if (currentUserReaction === type) {
        // User clicked same reaction => remove
        setLocalReactions((prev) => prev.filter((r) => r.user_id !== user.id))
        await removeReaction()
      } else {
        // User clicked new reaction => add or replace
        const newReaction = {
          id: `temp-${user.id}-${type}`,
          thread_id: threadId,
          created_at: new Date().toISOString(),
          user: user,
          user_id: user.id,
          emoji: type,
        }

        setLocalReactions((prev) => [
          ...prev.filter((r) => r.user_id !== user.id),
          newReaction,
        ])

        await addReaction(type)
      }
    } catch (error) {
      console.error('Error handling reaction:', error)
      // If there's an error, we don't need to do anything special with the UI
      // The optimistic update will remain, which is fine for most UIs
    }
  }

  // Safely get the counts
  const getReactionCount = (type: ReactionType) => {
    if (!localReactions) return 0
    return localReactions.filter((r) => r.emoji === type).length
  }

  return (
    <div className="flex space-x-1">
      <TooltipProvider>
        {reactionsList.map(({ type, icon, label }) => {
          const count = getReactionCount(type)
          const isActive = getUserReaction() === type

          return (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction(type)}
                  disabled={!user || isLoading}
                  className={`px-2 ${
                    isActive ? 'text-primary bg-primary/10' : ''
                  }`}
                >
                  <span className="flex items-center">
                    {icon}
                    {count > 0 && <span className="ml-1 text-xs">{count}</span>}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>
    </div>
  )
}
