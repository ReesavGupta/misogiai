'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { BookMarkedIcon, BookmarkIcon, MessageSquare } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '../context/AuthContext'
import { useBookmark } from '../hooks/useBookmark'
import ReactionButtons from './ReactionButtons'
import type { Thread } from '../types/index'

interface ThreadCardProps {
  thread: Thread
}

export default function ThreadCard({ thread }: ThreadCardProps) {
  const { user } = useAuth()
  const { isBookmarked, toggleBookmark, isLoading } = useBookmark(thread.id)
  const [showFullContent, setShowFullContent] = useState(false)

  // Get first two segments for preview
  const previewSegments = thread.segments.slice(0, 2)

  // Calculate if there are more segments to show
  const hasMoreSegments = thread.segments.length > 2

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Link to={`/thread/${thread.id}`}>
            <CardTitle className="text-xl hover:text-primary/80 transition-colors">
              {thread.title}
            </CardTitle>
          </Link>
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBookmark()}
              disabled={isLoading}
              // className={isBookmarked ? 'text-primary font-bold' : ''}
            >
              {!isBookmarked ? (
                <BookmarkIcon
                  size={18}
                  className="text-primary"
                />
              ) : (
                <BookMarkedIcon
                  size={18}
                  className="text-primary"
                />
              )}
              <span className="sr-only">Bookmark</span>
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {thread.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          By {thread.author.name} •{' '}
          {formatDistanceToNow(new Date(thread.created_at), {
            addSuffix: true,
          })}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(showFullContent ? thread.segments : previewSegments).map(
            (segment, index) => (
              <div
                key={segment.id}
                className="thread-segment"
              >
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {segment.content}
                </div>
                {segment.image_url && (
                  <img
                    src={segment.image_url || '/placeholder.svg'}
                    alt={`Segment ${index + 1} image`}
                    className="mt-3 rounded-md max-h-64 object-cover"
                  />
                )}
              </div>
            )
          )}

          {hasMoreSegments && !showFullContent && (
            <Button
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => setShowFullContent(true)}
            >
              Show more segments...
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-3 border-t">
        <ReactionButtons
          threadId={thread.id}
          reactions={thread.reactions}
        />
        <div className="flex items-center text-muted-foreground">
          <MessageSquare
            size={16}
            className="mr-1"
          />
          {/* <span className="text-sm">{thread.comments.length}</span> */}
        </div>
      </CardFooter>
    </Card>
  )
}
