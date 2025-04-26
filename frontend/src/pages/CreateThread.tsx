'use client'

import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import ThreadEditor from '../components/ThreadEditor'
import { threadService } from '../services/ThreadService'
import type { Thread } from '../types'

export default function CreateThreadPage() {
  const navigate = useNavigate()

  const createThreadMutation = useMutation({
    mutationFn: (data: { thread: Partial<Thread>; publish: boolean }) =>
      threadService.createThread(data.thread, data.publish),
    onSuccess: (threadId) => {
      toast.success('Your thread has been created successfully.')
      navigate(`/thread/${threadId}`)
    },
    onError: () => {
      toast.error('Failed to create thread. Please try again.')
    },
  })

  const handleSave = (thread: Partial<Thread>, publish: boolean) => {
    createThreadMutation.mutate({ thread, publish })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create a New Thread</h1>
        <p className="text-muted-foreground mt-2">
          Share your wisdom with the community
        </p>
      </div>

      <ThreadEditor
        onSave={handleSave}
        isLoading={createThreadMutation.isLoading}
      />

      <div className="mt-8 border-t pt-4">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={createThreadMutation.isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
