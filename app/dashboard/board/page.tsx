"use client"

import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { DashboardShell } from "@/components/dashboard/shell"
import { DashboardHeader } from "@/components/dashboard/header"
import { KanbanColumn } from "@/components/kanban/column"
import { KanbanCard } from "@/components/kanban/card"

const initialColumns = {
  todo: {
    id: "todo",
    title: "To Do",
    taskIds: ["task-1", "task-2"],
  },
  inProgress: {
    id: "inProgress",
    title: "In Progress",
    taskIds: ["task-3"],
  },
  done: {
    id: "done",
    title: "Done",
    taskIds: ["task-4"],
  },
}

const initialTasks = {
  "task-1": {
    id: "task-1",
    title: "Create login page",
    description: "Implement user authentication",
  },
  "task-2": {
    id: "task-2",
    title: "Design dashboard",
    description: "Create wireframes",
  },
  "task-3": {
    id: "task-3",
    title: "Implement drag and drop",
    description: "Add DnD functionality to boards",
  },
  "task-4": {
    id: "task-4",
    title: "Set up project",
    description: "Initialize Next.js project",
  },
}

export default function BoardPage() {
  const [columns, setColumns] = useState(initialColumns)
  const [tasks, setTasks] = useState(initialTasks)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragStart(event: any) {
    const { active } = event
    setActiveId(active.id)
  }

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    const activeColumn = Object.values(columns).find((col) =>
      col.taskIds.includes(activeId)
    )
    const overColumn = Object.values(columns).find((col) =>
      col.taskIds.includes(overId)
    )

    if (!activeColumn || !overColumn) return

    if (activeColumn.id === overColumn.id) {
      const newTaskIds = [...activeColumn.taskIds]
      const oldIndex = newTaskIds.indexOf(activeId)
      const newIndex = newTaskIds.indexOf(overId)

      newTaskIds.splice(oldIndex, 1)
      newTaskIds.splice(newIndex, 0, activeId)

      setColumns({
        ...columns,
        [activeColumn.id]: {
          ...activeColumn,
          taskIds: newTaskIds,
        },
      })
    } else {
      const sourceTaskIds = [...activeColumn.taskIds]
      const destinationTaskIds = [...overColumn.taskIds]

      const sourceIndex = sourceTaskIds.indexOf(activeId)
      const destinationIndex = destinationTaskIds.indexOf(overId)

      sourceTaskIds.splice(sourceIndex, 1)
      destinationTaskIds.splice(destinationIndex, 0, activeId)

      setColumns({
        ...columns,
        [activeColumn.id]: {
          ...activeColumn,
          taskIds: sourceTaskIds,
        },
        [overColumn.id]: {
          ...overColumn,
          taskIds: destinationTaskIds,
        },
      })
    }

    setActiveId(null)
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Kanban Board"
        text="Manage and organize your tasks"
      >
        <Button
          onClick={() => {
            setSelectedTask(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DashboardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {Object.values(columns).map((column) => (
            <KanbanColumn key={column.id} column={column}>
              <SortableContext items={column.taskIds}>
                {column.taskIds.map((taskId) => (
                  <KanbanCard
                    key={taskId}
                    task={tasks[taskId]}
                    onClick={() => {
                      setSelectedTask(tasks[taskId])
                      setIsDialogOpen(true)
                    }}
                  />
                ))}
              </SortableContext>
            </KanbanColumn>
          ))}
          <DragOverlay>
            {activeId ? (
              <Card className="p-4 cursor-grabbing">
                <h4 className="font-medium">{tasks[activeId].title}</h4>
                <p className="text-sm text-muted-foreground">
                  {tasks[activeId].description}
                </p>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={selectedTask}
        onSave={(newTask) => {
          if (selectedTask) {
            setTasks({
              ...tasks,
              [selectedTask.id]: { ...newTask, id: selectedTask.id },
            })
          } else {
            const taskId = `task-${Object.keys(tasks).length + 1}`
            setTasks({
              ...tasks,
              [taskId]: { ...newTask, id: taskId },
            })
            setColumns({
              ...columns,
              todo: {
                ...columns.todo,
                taskIds: [...columns.todo.taskIds, taskId],
              },
            })
          }
          setIsDialogOpen(false)
        }}
      />
    </DashboardShell>
  )
}