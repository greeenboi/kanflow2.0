'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { DashboardHeader } from '@/components/dashboard/header';
import { type Board, getBoardById } from '@/actions/dashboard/kanban/boards';
import {
  getTasksByBoard,
  moveTask,
  type Task,
  type TaskStatus,
  createTask,
} from '@/actions/dashboard/kanban/tasks';
import type { TaskFormData } from '@/types/kanban';
import { KanbanCard } from '@/components/kanban/card';
import { TaskDetailsDialog } from '@/components/tasks/task-details-dialog';
import { CoolMode } from '@/components/ui/cool-mode';
import { useHotkeys } from 'react-hotkeys-hook';
import { BoardMetadataHover } from '@/components/dashboard/board-metadata-hover';
import { useRouter } from 'next/navigation';

type Column = {
  id: string;
  title: string;
  status: TaskStatus;
  tasks: Task[];
};

type PendingChange = {
  taskId: number;
  newColumnId: number;
  orderNum: number;
  status: TaskStatus;
};

export default function BoardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boardId = Number(searchParams.get('board'));
  const taskId = searchParams.get('task');

  const [boardMetadata, setBoardMetadata] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([
    { id: '1', title: 'To Do', status: 'todo', tasks: [] },
    { id: '2', title: 'In Progress', status: 'in_progress', tasks: [] },
    { id: '3', title: 'Done', status: 'done', tasks: [] },
  ]);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState('Loading...');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedTaskForDetails, setSelectedTaskForDetails] =
    useState<Task | null>(null);

  useEffect(() => {
    async function loadBoardData() {
      if (!boardId) return;

      const board = await getBoardById(boardId);
      if (board) {
        setBoardMetadata(board);
        setBoardTitle(board.name);
      }

      const boardTasks = await getTasksByBoard(boardId);

      setColumns(prev =>
        prev.map(column => ({
          ...column,
          tasks: boardTasks.filter(task => task.status === column.status),
        }))
      );

      // If taskId is present in URL, find and open that task
      if (taskId) {
        const task = boardTasks.find(t => t.id === Number(taskId));
        if (task) {
          setSelectedTaskForDetails(task);
          setIsDetailsDialogOpen(true);
        }
      }
    }

    loadBoardData();
  }, [boardId, taskId]);

  const moveTaskToColumn = (
    taskId: number,
    fromColumnId: string,
    toColumnId: string
  ) => {
    const newColumns = [...columns];
    const fromColumn = newColumns.find(col => col.id === fromColumnId);
    const toColumn = newColumns.find(col => col.id === toColumnId);

    if (!fromColumn || !toColumn) return;

    const taskIndex = fromColumn.tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;

    const [task] = fromColumn.tasks.splice(taskIndex, 1);
    const updatedTask = {
      ...task,
      status: toColumn.status,
      column_id: Number(toColumn.id),
    };
    toColumn.tasks.push(updatedTask);

    setColumns(newColumns);

    setPendingChanges(prev => [
      ...prev,
      {
        taskId,
        newColumnId: Number(toColumn.id),
        orderNum: toColumn.tasks.length,
        status: toColumn.status,
      },
    ]);
  };

  const handleBatchSave = async () => {
    try {
      for (const change of pendingChanges) {
        // Update both position and status in the database
        await moveTask(
          change.taskId,
          change.newColumnId,
          change.orderNum,
          change.status // Add status parameter
        );
      }
      setPendingChanges([]);
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  const handleTaskSave = async (taskData: TaskFormData) => {
    try {
      if (selectedTask) {
        // Handle update logic coming soon
      } else {
        const newTaskId = await createTask({
          board_id: boardId,
          title: taskData.title,
          description: taskData.description,
          column_id: 1, // Start in todo column
          priority: taskData.priority,
          due_date: taskData.due_date?.toISOString(),
        });

        // Create the new task object
        const newTask: Task = {
          id: newTaskId,
          board_id: boardId,
          title: taskData.title,
          description: taskData.description || '',
          priority: taskData.priority || 'medium',
          status: 'todo',
          due_date: taskData.due_date?.toISOString(),
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          comments_enabled: true,
          estimated_time: taskData.estimated_time
            ? Number(taskData.estimated_time)
            : undefined,
          markdown_content: taskData.markdown_content,
          time_to_complete: taskData.time_to_complete,
          checklist: JSON.stringify(taskData.checklist || []),
          order_num: 0,
          column_id: 1,
        };

        // Update columns state
        setColumns(prev =>
          prev.map(col => {
            if (col.id === '1') {
              // Add to todo column
              return {
                ...col,
                tasks: [...col.tasks, newTask],
              };
            }
            return col;
          })
        );
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  // Add hotkey handlers
  useHotkeys(
    'ctrl+s',
    (e: KeyboardEvent) => {
      e.preventDefault();
      if (pendingChanges.length > 0) {
        handleBatchSave();
      }
    },
    [pendingChanges, handleBatchSave]
  );

  useHotkeys(
    'ctrl+n',
    (e: KeyboardEvent) => {
      e.preventDefault();
      setIsDialogOpen(true);
    },
    [setIsDialogOpen]
  );

  // Add this new function to handle dialog close
  const handleDetailsDialogClose = (open: boolean) => {
    setIsDetailsDialogOpen(open);
    if (!open) {
      // Remove task parameter from URL when dialog is closed
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('task');
      router.replace(`?${newParams.toString()}`);
    }
  };

  return (
    <>
      <DashboardHeader
        heading={boardTitle}
        metadata={
          <BoardMetadataHover board={boardMetadata}>
            <span className="cursor-help">{boardMetadata?.description}</span>
          </BoardMetadataHover>
        }
      >
        <div className="flex flex-row gap-2 justify-end items-center">
          {pendingChanges.length > 0 && (
            <CoolMode>
              <Button
                onClick={handleBatchSave}
                className="flex gap-2 items-center"
              >
                <Save /> Save ({pendingChanges.length})
              </Button>
            </CoolMode>
          )}
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </DashboardHeader>
      <section className="relative w-full overflow-hidden h-full">
        <div className="grid grid-cols-3 gap-4 overflow-auto h-full">
          {columns.map((column, columnIndex) => (
            <div
              key={column.id}
              className="flex flex-col gap-4 p-4 bg-secondary/50 rounded-xl h-full"
            >
              <h3 className="font-semibold text-lg">{column.title}</h3>
              <div className="flex flex-col gap-2">
                {column.tasks.map(task => (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    onClick={() => {
                      setSelectedTaskForDetails(task);
                      setIsDetailsDialogOpen(true);
                    }}
                    MoveTaskChild={
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            moveTaskToColumn(
                              task.id,
                              column.id,
                              columns[columnIndex - 1]?.id
                            )
                          }
                          disabled={columnIndex === 0}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            moveTaskToColumn(
                              task.id,
                              column.id,
                              columns[columnIndex + 1]?.id
                            )
                          }
                          disabled={columnIndex === columns.length - 1}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={selectedTask}
        onSave={handleTaskSave}
      />
      <TaskDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={handleDetailsDialogClose}
        task={selectedTaskForDetails}
      />
    </>
  );
}
