'use client'

import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Lock, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ThreadCard from '../components/ThreadCard'
import { collectionService } from '../services/CollectionService'

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: collection, isLoading } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => collectionService.getCollectionById(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Collection not found</h2>
        <p className="text-muted-foreground mt-2">
          The collection you're looking for doesn't exist or you don't have
          permission to view it.
        </p>
        <Button
          asChild
          className="mt-4"
        >
          <Link to="/collections">Go back to collections</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Button
          asChild
          variant="ghost"
          className="mb-4"
        >
          <Link to="/collections">
            <ArrowLeft
              size={16}
              className="mr-2"
            />
            Back to Collections
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{collection.name}</h1>
            <div className="flex items-center text-muted-foreground mt-2">
              {collection.is_private ? (
                <>
                  <Lock
                    size={16}
                    className="mr-1"
                  />
                  Private Collection
                </>
              ) : (
                <>
                  <Globe
                    size={16}
                    className="mr-1"
                  />
                  Public Collection
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {collection.bookmarks.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium">No threads in this collection</h3>
          <p className="text-muted-foreground mt-2">
            Bookmark threads to add them to this collection
          </p>
          <Button
            asChild
            className="mt-4"
          >
            <Link to="/">Browse Threads</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {collection.bookmarks.map((bookmark: any) => (
            <ThreadCard
              key={bookmark.id}
              thread={bookmark.thread}
            />
          ))}
        </div>
      )}
    </div>
  )
}
