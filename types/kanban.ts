import type { Task } from '@/actions/dashboard/kanban/tasks';

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

export type DragStartEvent = {
  active: { id: number };
  over: null;
};

export type DragEndEvent = {
  active: { id: number };
  over: { id: number } | null;
};

export interface KanbanDndContext {
  tasks: { [key: number]: Task };
  columns: {
    [key: string]: {
      id: number;
      title: string;
      taskIds: number[];
    };
  };
}
