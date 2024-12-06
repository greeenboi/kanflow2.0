"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"

interface KanbanCardProps {
  task: {
    id: string
    title: string
    description: string
  }
  onClick: () => void
}

export function KanbanCard({ task, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <h4 className="font-medium">{task.title}</h4>
      <p className="text-sm text-muted-foreground">{task.description}</p>
    </Card>
  )
}