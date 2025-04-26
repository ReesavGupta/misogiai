'use client'

import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { PenLine } from 'lucide-react'
import ThreadCard from '../components/ThreadCard'
import { useAuth } from '../context/AuthContext'
import { threadService } from '../services/ThreadService'

export default function ProfilePage() {
  const { user } = useAuth()

  const { data: publishedThreads, isLoading: isLoadingPublished } = useQuery({
    queryKey: ['my-threads', 'published'],
    queryFn: () => threadService.getMyThreads('published'),
  })

  const { data: draftThreads, isLoading: isLoadingDrafts } = useQuery({
    queryKey: ['my-threads', 'drafts'],
    queryFn: () => threadService.getMyThreads('drafts'),
  })

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your threads and drafts
          </p>
        </div>

        <Button asChild>
          <Link to="/create">
            <PenLine
              size={16}
              className="mr-2"
            />
            Create Thread
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="published">
        <TabsList className="mb-6">
          <TabsTrigger value="published">Published Threads</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent
          value="published"
          className="space-y-6"
        >
          {isLoadingPublished ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : publishedThreads?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No published threads yet</h3>
              <p className="text-muted-foreground mt-2">
                Start sharing your wisdom with the community
              </p>
              <Button
                asChild
                className="mt-4"
              >
                <Link to="/create">Create Thread</Link>
              </Button>
            </div>
          ) : (
            publishedThreads?.map((thread) => (
              <ThreadCard
                key={thread.id}
                thread={thread}
              />
            ))
          )}
        </TabsContent>

        <TabsContent
          value="drafts"
          className="space-y-6"
        >
          {isLoadingDrafts ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : draftThreads?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No drafts</h3>
              <p className="text-muted-foreground mt-2">
                You don't have any draft threads
              </p>
              <Button
                asChild
                className="mt-4"
              >
                <Link to="/create">Create Thread</Link>
              </Button>
            </div>
          ) : (
            draftThreads?.map((thread) => (
              <div
                key={thread.id}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">
                    {thread.title || 'Untitled Draft'}
                  </h3>
                  <div className="text-xs text-muted-foreground">Draft</div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {thread.segments[0]?.content || 'No content yet'}
                </p>
                <div className="flex space-x-2">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                  >
                    <Link to={`/edit/${thread.id}`}>Continue Editing</Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
