'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import {
  getTasksByDueDate,
  type TasksByDate,
} from '@/actions/dashboard/kanban/tasks';
import { format } from 'date-fns';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

export function DatePicker() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [tasks, setTasks] = useState<TasksByDate[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      if (selectedDate) {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const tasksDue = await getTasksByDueDate(formattedDate);
        setTasks(tasksDue);
      }
    }
    fetchTasks();
  }, [selectedDate]);

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  return (
    <SidebarGroup className="max-h-96 overflow-y-auto px-0 mx-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent">
      <SidebarGroupLabel className="mx-4">Tasks Tracker</SidebarGroupLabel>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className=""
      />

      <SidebarGroupContent>
        <div className="px-4 py-2">
          <h3 className="font-semibold mb-2">
            Tasks Due on{' '}
            {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Today'}
          </h3>
          <ScrollArea className="h-[200px]">
            {tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.map(task => (
                  <Link
                    key={task.id}
                    href={`/dashboard/board?board=${task.board_id}&task=${task.id}`}
                    className="block"
                  >
                    <div className="p-2 rounded-md hover:bg-accent transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-sm truncate">{task.title}</span>
                        <Badge
                          variant="secondary"
                          className={priorityColors[task.priority]}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No tasks due on this date
              </div>
            )}
          </ScrollArea>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
