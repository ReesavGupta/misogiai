'use client'

import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import {
  BookmarkIcon,
  MessageSquare,
  Share2,
  Pencil,
  Trash2,
  GitFork,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '../context/AuthContext'
import { useBookmark } from '../hooks/useBookmark'
import ReactionButtons from '../components/ReactionButtons'
import { threadService } from '../services/ThreadService'
import { commentService } from '../services/CommentService'
import { Comment } from '../types'

export default function ThreadPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [commentText, setCommentText] = useState('')

  const { data: thread, isLoading } = useQuery({
    queryKey: ['thread', id],
    queryFn: () => threadService.getThreadById(id!),
    enabled: !!id,
  })

  const { isBookmarked, toggleBookmark } = useBookmark(id!)

  const deleteThreadMutation = useMutation({
    mutationFn: () => threadService.deleteThread(id!),
    onSuccess: () => {
      navigate('/')
      toast({
        title: 'Thread deleted',
        description: 'Your thread has been deleted successfully.',
      })
    },
  })

  const remixThreadMutation = useMutation({
    mutationFn: () => threadService.remixThread(id!),
    onSuccess: (newThreadId) => {
      navigate(`/edit/${newThreadId}`)
      toast({
        title: 'Thread remixed',
        description: 'You can now edit your remixed version.',
      })
    },
  })

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => commentService.addComment(id!, content),
    onSuccess: () => {
      setCommentText('')
      queryClient.invalidateQueries({ queryKey: ['thread', id] })
      toast({
        title: 'Comment added',
        description: 'Your comment has been added successfully.',
      })
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thread', id] })
      toast({
        title: 'Comment deleted',
        description: 'Your comment has been deleted successfully.',
      })
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Thread not found</h2>
        <p className="text-muted-foreground mt-2">
          The thread you're looking for doesn't exist or has been removed.
        </p>
        <Button
          asChild
          className="mt-4"
        >
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    )
  }

  const isAuthor = user?.id === thread.author.id

  const handleAddComment = () => {
    if (!commentText.trim()) return
    addCommentMutation.mutate(commentText)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">{thread.title}</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          {thread.tags.map((tag: string) => (
            <Badge
              key={tag}
              variant="secondary"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            By {thread.author.name} •{' '}
            {formatDistanceToNow(new Date(thread.created_at), {
              addSuffix: true,
            })}
            {thread.remix_of_thread_id && (
              <span className="ml-2">• Remixed from another thread</span>
            )}
          </div>

          <div className="flex space-x-2">
            {user && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleBookmark()}
                  className={isBookmarked ? 'text-primary' : ''}
                >
                  <BookmarkIcon size={18} />
                  <span className="sr-only">Bookmark</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remixThreadMutation.mutate()}
                >
                  <GitFork size={18} />
                  <span className="sr-only">Remix</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    // Copy URL to clipboard
                    navigator.clipboard.writeText(window.location.href)
                    toast({
                      title: 'Link copied',
                      description: 'Thread link copied to clipboard',
                    })
                  }}
                >
                  <Share2 size={18} />
                  <span className="sr-only">Share</span>
                </Button>
              </>
            )}

            {isAuthor && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/edit/${thread.id}`)}
                >
                  <Pencil size={18} />
                  <span className="sr-only">Edit</span>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                    >
                      <Trash2 size={18} />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your thread.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteThreadMutation.mutate()}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        {thread.segments.map((segment: any, index: number) => (
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
                className="mt-3 rounded-md max-h-96 object-cover"
              />
            )}
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <ReactionButtons
            threadId={thread.id}
            reactions={thread.reactions}
          />
          <div className="flex items-center text-muted-foreground">
            <MessageSquare
              size={16}
              className="mr-1"
            />
            <span>{thread.comments.length} comments</span>
          </div>
        </div>
      </div>

      {user ? (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Add a comment</h3>
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            className="mb-2"
          />
          <Button
            onClick={handleAddComment}
            disabled={!commentText.trim() || addCommentMutation.isLoading}
          >
            {addCommentMutation.isLoading ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      ) : (
        <div className="bg-muted p-4 rounded-md mb-8">
          <p className="text-center">
            <Link
              to="/login"
              className="text-primary hover:underline"
            >
              Sign in
            </Link>{' '}
            to add a comment
          </p>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-lg font-medium">
          Comments ({thread.comments.length})
        </h3>

        {thread.comments.length === 0 ? (
          <p className="text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          thread.comments.map((comment: Comment) => (
            <div
              key={comment.id}
              className="border rounded-md p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">{comment.user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <p className="text-sm mb-2">{comment.content}</p>

              {user?.id === comment.user_id && (
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCommentMutation.mutate(comment.id)}
                    disabled={deleteCommentMutation.isLoading}
                  >
                    <Trash2
                      size={14}
                      className="mr-1"
                    />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
