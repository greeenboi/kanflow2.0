'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, CheckSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Task } from '@/actions/dashboard/kanban/tasks';

interface ChecklistItem {
  checked: boolean;
}

interface KanbanCardProps {
  task: Task;
  onClick: () => void;
  MoveTaskChild: React.ReactNode;
}

export function KanbanCard({ task, onClick, MoveTaskChild }: KanbanCardProps) {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  return (
    <Card
      className="p-4 hover:shadow-md transition-shadow space-y-2 cursor-pointer"
      onClick={e => {
        if (
          e.currentTarget === e.target ||
          (e.target instanceof Element && !e.target.closest('button'))
        ) {
          onClick();
        }
      }}
    >
      <h4 className="font-medium">{task.title}</h4>
      {task.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        <Badge variant="secondary" className={priorityColors[task.priority]}>
          {task.priority}
        </Badge>

        {task.due_date && (
          <Badge variant="outline" className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
          </Badge>
        )}

        {task.estimated_time && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {task.estimated_time}h
          </Badge>
        )}
        {task.checklist && (
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckSquare className="h-3 w-3" />
            {
              JSON.parse(task.checklist).filter(
                (item: ChecklistItem) => item.checked
              ).length
            }
            /{JSON.parse(task.checklist).length}
          </Badge>
        )}
      </div>
      {MoveTaskChild}
    </Card>
  );
}
