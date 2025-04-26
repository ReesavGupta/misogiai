'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { TagInput } from './TagInput'
import ThreadSegmentEditor from './ThreadSegmentEditor'
import type { Thread, ThreadSegment } from '../types/index'

interface ThreadEditorProps {
  initialThread?: Partial<Thread>
  onSave: (thread: Partial<Thread>, publish: boolean) => void
  isLoading: boolean
}

export default function ThreadEditor({
  initialThread,
  onSave,
  isLoading,
}: ThreadEditorProps) {
  const [title, setTitle] = useState(initialThread?.title || '')
  const [tags, setTags] = useState<string[]>(initialThread?.tags || [])
  const [segments, setSegments] = useState<ThreadSegment[]>(
    initialThread?.segments || [
      {
        id: uuidv4(),
        thread_id: initialThread?.id || '',
        order_index: 0,
        content: '',
        image_url: null,
      },
    ]
  )

  const handleUpdateSegment = (
    id: string,
    content: string,
    imageUrl?: string | null
  ) => {
    setSegments((prev) =>
      prev.map((segment) =>
        segment.id === id
          ? { ...segment, content, image_url: imageUrl || null }
          : segment
      )
    )
  }

  const handleDeleteSegment = (id: string) => {
    if (segments.length <= 1) return

    setSegments((prev) => {
      const filtered = prev.filter((segment) => segment.id !== id)
      // Update order indexes
      return filtered.map((segment, index) => ({
        ...segment,
        order_index: index,
      }))
    })
  }

  const handleAddSegment = (afterIndex: number) => {
    setSegments((prev) => {
      const newSegments = [...prev]
      const newSegment: ThreadSegment = {
        id: uuidv4(),
        thread_id: initialThread?.id || '',
        order_index: afterIndex + 1,
        content: '',
        image_url: null,
      }

      // Insert new segment after the specified index
      newSegments.splice(afterIndex + 1, 0, newSegment)

      // Update order indexes
      return newSegments.map((segment, index) => ({
        ...segment,
        order_index: index,
      }))
    })
  }

  const handleMoveSegment = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === segments.length - 1)
    ) {
      return
    }

    setSegments((prev) => {
      const newSegments = [...prev]
      const targetIndex = direction === 'up' ? index - 1 : index + 1

      // Swap segments
      ;[newSegments[index], newSegments[targetIndex]] = [
        newSegments[targetIndex],
        newSegments[index],
      ]

      // Update order indexes
      return newSegments.map((segment, idx) => ({
        ...segment,
        order_index: idx,
      }))
    })
  }

  const handleSave = (publish: boolean) => {
    onSave(
      {
        title,
        tags,
        segments,
        is_published: publish,
      },
      publish
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e: any) => setTitle(e.target.value)}
          placeholder="Enter a title for your thread"
          className="text-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <TagInput
          id="tags"
          value={tags}
          onChange={setTags}
          placeholder="Add tags (press Enter after each tag)"
          maxTags={5}
        />
        <p className="text-xs text-muted-foreground">
          Add up to 5 tags to help others find your thread
        </p>
      </div>

      <div className="space-y-4">
        <Label>Thread Segments</Label>
        {segments.map((segment, index) => (
          <ThreadSegmentEditor
            key={segment.id}
            segment={segment}
            index={index}
            isLast={index === segments.length - 1}
            onUpdate={handleUpdateSegment}
            onDelete={handleDeleteSegment}
            onAddAfter={handleAddSegment}
            onMoveUp={(idx) => handleMoveSegment(idx, 'up')}
            onMoveDown={(idx) => handleMoveSegment(idx, 'down')}
          />
        ))}
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => handleSave(false)}
          disabled={isLoading}
        >
          Save Draft
        </Button>
        <Button
          onClick={() => handleSave(true)}
          disabled={isLoading}
        >
          Publish
        </Button>
      </div>
    </div>
  )
}
