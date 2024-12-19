'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import type { Task } from '@/actions/dashboard/kanban/tasks';
import type { TaskFormData } from '@/types/kanban';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSave: (data: TaskFormData) => Promise<void>;
}

export function TaskDialog({ open, onOpenChange, task, onSave }: TaskDialogProps) {
  const { register, handleSubmit, reset } = useForm<TaskFormData>({
    defaultValues: task ? {
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      priority: task.priority
    } : {
      title: '',
      description: '',
      priority: 'medium'
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <Input {...register('title')} placeholder="Task title" />
          <Textarea {...register('description')} placeholder="Task description" />
          <Button type="submit">{task ? 'Update' : 'Create'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
