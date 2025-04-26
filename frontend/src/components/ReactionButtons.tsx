'use client'

import type React from 'react'
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
import type { Reaction, ReactionType } from '../types/index'

interface ReactionButtonsProps {
  threadId: string
  reactions: Reaction[]
}

type ReactionInfo = {
  type: ReactionType
  icon: React.ReactNode
  label: string
}

export default function ReactionButtons({
  threadId,
  reactions,
}: ReactionButtonsProps) {
  const { user } = useAuth()
  const { addReaction, removeReaction, isLoading } = useReaction(threadId)

  // Find user's current reaction if logged in
  const userReaction = user
    ? reactions.find((r) => r.user_id === user.id)?.emoji
    : undefined

  const reactionTypes: ReactionInfo[] = [
    { type: 'brain', icon: <Brain size={16} />, label: 'Insightful' },
    { type: 'fire', icon: <Flame size={16} />, label: 'Fire' },
    { type: 'clap', icon: <Clap size={16} />, label: 'Applause' },
    { type: 'eyes', icon: <Eye size={16} />, label: 'Interesting' },
    { type: 'warning', icon: <AlertTriangle size={16} />, label: 'Caution' },
  ]

  // Count reactions by type
  const reactionCounts = reactionTypes.reduce((acc, { type }) => {
    acc[type] = reactions.filter((r) => r.emoji === type).length
    return acc
  }, {} as Record<ReactionType, number>)

  const handleReaction = (type: ReactionType) => {
    if (!user) return

    if (userReaction === type) {
      removeReaction()
    } else {
      addReaction(type)
    }
  }

  return (
    <div className="flex space-x-1">
      <TooltipProvider>
        {reactionTypes.map(({ type, icon, label }) => (
          <Tooltip key={type}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`px-2 ${
                  userReaction === type ? 'text-primary bg-primary/10' : ''
                }`}
                onClick={() => handleReaction(type)}
                disabled={isLoading || !user}
              >
                <span className="flex items-center">
                  {icon}
                  {reactionCounts[type] > 0 && (
                    <span className="ml-1 text-xs">{reactionCounts[type]}</span>
                  )}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}
