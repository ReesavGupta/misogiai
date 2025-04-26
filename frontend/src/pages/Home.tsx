'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import ThreadCard from '../components/ThreadCard'
import { threadService } from '../services/ThreadService'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const { data: threads, isLoading } = useQuery({
    queryKey: ['threads', activeTab, searchQuery, selectedTags],
    queryFn: () =>
      threadService.getThreads({
        sort: activeTab.toString(),
        search: searchQuery,
        tags: selectedTags,
      }),
  })

  const { data: popularTags } = useQuery({
    queryKey: ['tags'],
    queryFn: () => threadService.getPopularTags(),
  })

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
  }

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Wisdom Threads</h1>
        <p className="text-muted-foreground">
          Discover thoughtful insights and wisdom from the community
        </p>
      </section>

      <section className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search threads..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {(searchQuery || selectedTags.length > 0) && (
            <Button
              variant="ghost"
              onClick={clearFilters}
            >
              <X
                size={16}
                className="mr-2"
              />
              Clear filters
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {popularTags?.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </section>

      <Tabs
        defaultValue="featured"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="most_bookmarked">Most Bookmarked</TabsTrigger>
          <TabsTrigger value="most_remixed">Most Remixed</TabsTrigger>
          <TabsTrigger value="newest">Newest</TabsTrigger>
        </TabsList>

        <TabsContent
          value={activeTab}
          className="space-y-6"
        >
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : threads?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No threads found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            threads?.map((thread) => (
              <ThreadCard
                key={thread.id}
                thread={thread}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
