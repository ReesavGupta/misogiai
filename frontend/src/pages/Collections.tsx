'use client'

import type React from 'react'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Lock, Globe, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'react-toastify'
import { collectionService } from '../services/CollectionService'

export default function CollectionsPage() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<any>(null)
  const [collectionName, setCollectionName] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)

  const { data: collections, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: () => collectionService.getMyCollections(),
  })

  const createCollectionMutation = useMutation({
    mutationFn: (data: { name: string; isPrivate: boolean }) =>
      collectionService.createCollection(data.name, data.isPrivate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      setIsDialogOpen(false)
      resetForm()
      toast.success('Collection created successfully.', {
        autoClose: 3000,
      })
    },
  })

  const updateCollectionMutation = useMutation({
    mutationFn: (data: { id: string; name: string; isPrivate: boolean }) =>
      collectionService.updateCollection(data.id, data.name, data.isPrivate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      setIsDialogOpen(false)
      resetForm()
      toast.success('Collection updated successfully.', {
        autoClose: 3000,
      })
    },
  })

  const deleteCollectionMutation = useMutation({
    mutationFn: (id: string) => collectionService.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      toast.success('Collection deleted successfully.', {
        autoClose: 3000,
      })
    },
  })

  const resetForm = () => {
    setCollectionName('')
    setIsPrivate(false)
    setEditingCollection(null)
  }

  const handleOpenDialog = (collection?: any) => {
    if (collection) {
      setEditingCollection(collection)
      setCollectionName(collection.name)
      setIsPrivate(collection.is_private)
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!collectionName.trim()) {
      toast.error('Please enter a collection name.', {
        autoClose: 3000,
      })
      return
    }

    if (editingCollection) {
      updateCollectionMutation.mutate({
        id: editingCollection.id,
        name: collectionName,
        isPrivate,
      })
    } else {
      createCollectionMutation.mutate({
        name: collectionName,
        isPrivate,
      })
    }
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Collections</h1>
          <p className="text-muted-foreground mt-2">
            Organize your favorite threads into collections
          </p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus
                size={16}
                className="mr-2"
              />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCollection ? 'Edit Collection' : 'Create Collection'}
              </DialogTitle>
              <DialogDescription>
                {editingCollection
                  ? 'Update your collection details'
                  : 'Create a new collection to organize your favorite threads'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Collection Name</Label>
                  <Input
                    id="name"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    placeholder="My Favorite Threads"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="private"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                  />
                  <Label htmlFor="private">Private Collection</Label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createCollectionMutation.isPending ||
                    updateCollectionMutation.isPending
                  }
                >
                  {editingCollection ? 'Save Changes' : 'Create Collection'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : collections?.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium">No collections yet</h3>
          <p className="text-muted-foreground mt-2">
            Create a collection to organize your favorite threads
          </p>
          <Button
            className="mt-4"
            onClick={() => handleOpenDialog()}
          >
            <Plus
              size={16}
              className="mr-2"
            />
            Create Collection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections?.map((collection) => (
            <Card key={collection.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{collection.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      {collection.is_private ? (
                        <>
                          <Lock
                            size={14}
                            className="mr-1"
                          />
                          Private
                        </>
                      ) : (
                        <>
                          <Globe
                            size={14}
                            className="mr-1"
                          />
                          Public
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(collection)}
                    >
                      <Pencil size={16} />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        deleteCollectionMutation.mutate(collection.id)
                      }
                    >
                      <Trash2 size={16} />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {collection.bookmarks.length} thread
                  {collection.bookmarks.length !== 1 ? 's' : ''}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <Link to={`/collections/${collection.id}`}>
                    View Collection
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
