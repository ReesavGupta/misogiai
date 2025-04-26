'use client'

import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import ThreadEditor from '../components/ThreadEditor'
import { threadService } from '../services/ThreadService'
import type { Thread } from '../types/index'

export default function EditThreadPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: thread, isLoading: isLoadingThread } = useQuery({
    queryKey: ['thread', id, 'edit'],
    queryFn: () => threadService.getThreadById(id!),
    enabled: !!id,
  })

  const updateThreadMutation = useMutation({
    mutationFn: (data: { thread: Partial<Thread>; publish: boolean }) =>
      threadService.updateThread(id!, data.thread, data.publish),
    onSuccess: () => {
      toast.success('Your thread has been updated successfully.')
      navigate(`/thread/${id}`)
    },
    onError: () => {
      toast.error('Failed to update thread. Please try again.')
    },
  })

  const handleSave = (updatedThread: Partial<Thread>, publish: boolean) => {
    updateThreadMutation.mutate({ thread: updatedThread, publish })
  }

  if (isLoadingThread) {
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
          The thread you're trying to edit doesn't exist or you don't have
          permission to edit it.
        </p>
        <Button
          asChild
          className="mt-4"
        >
          <a href="/">Go back home</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Thread</h1>
        <p className="text-muted-foreground mt-2">
          Make changes to your thread
        </p>
      </div>

      <ThreadEditor
        initialThread={thread}
        onSave={handleSave}
        isLoading={updateThreadMutation.isPending}
      />

      <div className="mt-8 border-t pt-4">
        <Button
          variant="outline"
          onClick={() => navigate(`/thread/${id}`)}
          disabled={updateThreadMutation.isPending}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
