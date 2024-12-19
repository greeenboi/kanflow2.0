'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createBoard } from '@/actions/dashboard/kanban/boards'
import type { CreateBoardData } from '@/actions/dashboard/kanban/boards'
import { useUser } from '@/context/UserContext'

interface CreateBoardDialogProps {
  children: React.ReactNode
  onBoardCreated?: () => void
}

export function CreateBoardDialog({ children, onBoardCreated }: CreateBoardDialogProps) {
  const [open, setOpen] = useState(false)
  const { user } = useUser()
  const [formData, setFormData] = useState<Partial<CreateBoardData>>({
    board_type: 'kanban',
    visibility: 'private',
    background_color: '#FFFFFF'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !formData.name) return

    try {
      await createBoard({
        ...formData,
        user_id: user.id,
        owner_id: user.id,
      } as CreateBoardData)
      setOpen(false)
      onBoardCreated?.()
    } catch (error) {
      console.error('Failed to create board:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
            <DialogDescription>
              Create a new board to organize your tasks and projects.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Board Type</Label>
              <Select
                value={formData.board_type}
                onValueChange={(value) => setFormData({ ...formData, board_type: value as CreateBoardData['board_type'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kanban">Kanban</SelectItem>
                  <SelectItem value="scrum">Scrum</SelectItem>
                  <SelectItem value="scrumban">Scrumban</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value) => setFormData({ ...formData, visibility: value as CreateBoardData['visibility'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Board</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
