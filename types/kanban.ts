import type { Task, TaskStatus } from '@/actions/dashboard/kanban/tasks';

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
