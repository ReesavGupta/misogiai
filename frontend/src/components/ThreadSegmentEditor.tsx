'use client'

import type React from 'react'

import { useState, useRef } from 'react'
import { Trash2, ImageIcon, Plus, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { ThreadSegment } from '../types/index'

interface ThreadSegmentEditorProps {
  segment: ThreadSegment
  index: number
  isLast: boolean
  onUpdate: (id: string, content: string, imageUrl?: string | null) => void
  onDelete: (id: string) => void
  onAddAfter: (index: number) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
}

export default function ThreadSegmentEditor({
  segment,
  index,
  isLast,
  onUpdate,
  onDelete,
  onAddAfter,
  onMoveUp,
  onMoveDown,
}: ThreadSegmentEditorProps) {
  const [content, setContent] = useState(segment.content)
  const [imageUrl, setImageUrl] = useState<string | null>(
    segment.image_url || null
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    onUpdate(segment.id, e.target.value, imageUrl)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload the file to a server and get a URL back
    // For this demo, we'll create a local object URL
    const localUrl = URL.createObjectURL(file)
    setImageUrl(localUrl)
    onUpdate(segment.id, content, localUrl)
  }

  const handleRemoveImage = () => {
    setImageUrl(null)
    onUpdate(segment.id, content, null)
  }

  return (
    <div className="thread-segment">
      <div className="flex justify-between mb-2">
        <div className="text-sm font-medium text-muted-foreground">
          Segment {index + 1}
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
          >
            <ArrowUp size={16} />
            <span className="sr-only">Move up</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMoveDown(index)}
            disabled={isLast}
          >
            <ArrowDown size={16} />
            <span className="sr-only">Move down</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(segment.id)}
          >
            <Trash2 size={16} />
            <span className="sr-only">Delete segment</span>
          </Button>
        </div>
      </div>

      <div className="editor-container">
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Write your thoughts here..."
          className="min-h-[120px] resize-y"
        />
      </div>

      {imageUrl ? (
        <div className="mt-2 relative">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt="Segment image"
            className="rounded-md max-h-64 object-cover"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            Remove
          </Button>
        </div>
      ) : (
        <div className="mt-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon
              size={16}
              className="mr-2"
            />
            Add Image
          </Button>
        </div>
      )}

      <div className="mt-4 text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddAfter(index)}
        >
          <Plus
            size={16}
            className="mr-2"
          />
          Add Segment
        </Button>
      </div>
    </div>
  )
}
