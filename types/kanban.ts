import type { Task, TaskStatus } from '@/actions/dashboard/kanban/tasks';
import type {
  DragStartEvent as DndDragStartEvent,
  DragEndEvent as DndDragEndEvent,
  UniqueIdentifier
} from '@dnd-kit/core';

export interface TaskFormData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: Date;
  estimated_time?: number;
  markdown_content?: string;
  time_to_complete?: string;
  checklist?: Array<{ text: string; checked: boolean }>;
}

// Use types from @dnd-kit/core
export type DragStartEvent = DndDragStartEvent;
export type DragEndEvent = DndDragEndEvent;

export type DNDType = {
  id: UniqueIdentifier;
  title: string;
  items: {
    id: UniqueIdentifier;
    title: string;
    // Add other Task properties
    status: 'todo' | 'in_progress' | 'done';
    column_id: number;
    // ...other existing Task properties...
  }[];
};

export type PendingChange = {
  taskId: number;
  newColumnId: number;
  orderNum: number;
  status: TaskStatus;
};

export interface TaskWithStringId extends Omit<Task, 'id' | 'column_id'> {
  id: string;
  column_id: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface KanbanDndContext {
  tasks: { [key: string]: TaskWithStringId };
  columns: {
    [key: string]: Column;
  };
}
