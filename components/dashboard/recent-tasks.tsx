import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import type { RecentTask } from '@/actions/dashboard/kanban/tasks';

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  done: 'bg-green-100 text-green-800',
  blocked: 'bg-red-100 text-red-800',
};

export function RecentTasks({ tasks }: { tasks: RecentTask[] }) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => (
            <Link
              key={task.id}
              href={`/dashboard/board?board=${task.board_id}&task=${task.id}`}
              className="block p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium line-clamp-1">{task.title}</h3>
                <Badge
                  className={
                    statusColors[task.status as keyof typeof statusColors]
                  }
                >
                  {task.status.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Created {formatDistanceToNow(new Date(task.created_at))} ago
              </p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
