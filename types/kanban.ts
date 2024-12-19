import type { Task } from '@/actions/dashboard/kanban/tasks';

export type TaskFormData = {
  title: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
};

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
