export type User = {
  id: string
  email: string
  name: string
  created_at: string
}

export type ReactionType = 'brain' | 'fire' | 'clap' | 'eyes' | 'warning'

export type Reaction = {
  id: string
  user_id: string
  thread_id: string
  emoji: ReactionType
  created_at: string
  user: User
}

export type ThreadSegment = {
  id: string
  thread_id: string
  order_index: number
  content: string
  image_url: string | null
}

export type Comment = {
  id: string
  user_id: string
  thread_id: string
  content: string
  created_at: string
  updated_at: string
  user: User
}

export type Thread = {
  id: string
  title: string
  tags: string[]
  author_id: string
  created_at: string
  updated_at: string
  is_published: boolean
  remix_of_thread_id: string | null
  author: User
  segments: ThreadSegment[]
  reactions: Reaction[]
  comments: Comment[]
}

export type Bookmark = {
  id: string
  user_id: string
  thread_id: string
  collection_id: string | null
  created_at: string
  thread: Thread
}

export type Collection = {
  id: string
  user_id: string
  name: string
  is_private: boolean
  created_at: string
  bookmarks: Bookmark[]
}

export type ThreadFilters = {
  sort?: 'featured' | 'most_bookmarked' | 'most_remixed' | 'newest'
  search?: string
  tags?: string[]
}
