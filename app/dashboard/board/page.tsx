'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { DashboardShell } from '@/components/dashboard/shell';
import { DashboardHeader } from '@/components/dashboard/header';
import { KanbanColumn } from '@/components/kanban/column';
import { KanbanCard } from '@/components/kanban/card';
import { type Board, getBoardById } from '@/actions/dashboard/kanban/boards';
import { getTasksByBoard, createTask, moveTask, type Task } from '@/actions/dashboard/kanban/tasks';
import type { DragStartEvent, DragEndEvent, TaskFormData, KanbanDndContext } from '@/types/kanban';
import { formatDistanceToNow } from 'date-fns';

interface Column {
  id: number;
  title: string;
  taskIds: number[];
}



const DEFAULT_COLUMNS: { [key: string]: Column } = {
  todo: { id: 1, title: 'To Do', taskIds: [] },
  inProgress: { id: 2, title: 'In Progress', taskIds: [] },
  done: { id: 3, title: 'Done', taskIds: [] },
};

export default function BoardPage() {
  const searchParams = useSearchParams();
  const boardId = Number(searchParams.get('board'));
  
  const [boardMetadata, setBoardMetadata] = useState<Board | null>(null);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [tasks, setTasks] = useState<{ [key: number]: Task }>({});
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [boardTitle, setBoardTitle] = useState('Loading...');

  useEffect(() => {
    async function loadBoardData() {
      if (!boardId) return;

      const board = await getBoardById(boardId);
      if (board) {
        setBoardMetadata(board);
        setBoardTitle(board.name);
      }

      const boardTasks = await getTasksByBoard(boardId);
      const tasksById: { [key: number]: Task } = {};
      const columnTaskIds: { [key: string]: number[] } = {
        todo: [],
        inProgress: [],
        done: [],
      };

      for (const task of boardTasks) {
        tasksById[task.id] = task;
        const columnKey = task.status === 'todo' ? 'todo' : 
                         task.status === 'in_progress' ? 'inProgress' : 'done';
        columnTaskIds[columnKey].push(task.id);
      }

      setTasks(tasksById);
      setColumns({
        todo: { ...DEFAULT_COLUMNS.todo, taskIds: columnTaskIds.todo },
        inProgress: { ...DEFAULT_COLUMNS.inProgress, taskIds: columnTaskIds.inProgress },
        done: { ...DEFAULT_COLUMNS.done, taskIds: columnTaskIds.done },
      });
    }

    loadBoardData();
  }, [boardId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = Object.values(columns).find(col =>
      col.taskIds.includes(activeId)
    );
    const overColumn = Object.values(columns).find(col =>
      col.taskIds.includes(overId)
    );

    if (!activeColumn || !overColumn) return;

    // Update local state first
    if (activeColumn.id === overColumn.id) {
      const newTaskIds = [...activeColumn.taskIds];
      const oldIndex = newTaskIds.indexOf(activeId);
      const newIndex = newTaskIds.indexOf(overId);

      newTaskIds.splice(oldIndex, 1);
      newTaskIds.splice(newIndex, 0, activeId);

      setColumns({
        ...columns,
        [activeColumn.id]: {
          ...activeColumn,
          taskIds: newTaskIds,
        },
      });
    } else {
      // Similar column update logic...
    }

    // Update the database
    const newStatus = overColumn.id === 1 ? 'todo' : 
                     overColumn.id === 2 ? 'in_progress' : 'done';
    await moveTask(activeId, overColumn.id, overId);

    setActiveId(null);
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={boardTitle}
        text={boardMetadata?.description || "Manage and organize your tasks"}
      >
        <div className="flex flex-col gap-2 items-end">
          {boardMetadata && (
            <div className="text-sm text-muted-foreground text-right">
              <p>Visibility: {boardMetadata.visibility}</p>
              <p>Created {formatDistanceToNow(new Date(boardMetadata.created_at))} ago</p>
              <p>Last updated {formatDistanceToNow(new Date(boardMetadata.last_updated))} ago</p>
            </div>
          )}
          <Button
            onClick={() => {
              setSelectedTask(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {Object.values(columns).map(column => (
            <KanbanColumn key={column.id} column={column}>
              <SortableContext items={column.taskIds}>
                {column.taskIds.map(taskId => (
                  <KanbanCard
                    key={taskId}
                    task={tasks[taskId]}
                    onClick={() => {
                      setSelectedTask(tasks[taskId]);
                      setIsDialogOpen(true);
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
        onSave={async (taskData: TaskFormData) => {
          if (selectedTask) {
            // Handle update
          } else {
            const newTaskId = await createTask({
              board_id: boardId,
              title: taskData.title,
              description: taskData.description,
              column_id: columns.todo.id,
              priority: taskData.priority,
              due_date: taskData.due_date
            });
            
            // Create a proper Task object
            const newTask: Task = {
              id: newTaskId,
              board_id: boardId,
              title: taskData.title,
              description: taskData.description,
              priority: taskData.priority || 'medium',
              status: 'todo',
              due_date: taskData.due_date,
              created_at: new Date().toISOString(),
              last_updated: new Date().toISOString(),
              comments_enabled: true,
              order_num: 0,
              column_id: columns.todo.id
            };
            
            // Update local state with the complete Task object
            setTasks(prev => ({
              ...prev,
              [newTaskId]: newTask
            }));
            
            setColumns(prev => ({
              ...prev,
              todo: {
                ...prev.todo,
                taskIds: [...prev.todo.taskIds, newTaskId]
              }
            }));
          }
          setIsDialogOpen(false);
        }}
      />
    </DashboardShell>
  );
}
