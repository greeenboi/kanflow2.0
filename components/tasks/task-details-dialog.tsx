'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  CalendarDays,
  Clock,
  User,
  Paperclip,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Task } from '@/actions/dashboard/kanban/tasks';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

function EmptyState({ message }: { message: string }) {
  return (
    <Alert variant="default" className="bg-muted/50">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export function TaskDetailsDialog({
  open,
  onOpenChange,
  task,
}: TaskDetailsDialogProps) {
  if (!task) return null;

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };
  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    done: 'bg-green-100 text-green-800',
    blocked: 'bg-red-100 text-red-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  const checklist = task.checklist ? JSON.parse(task.checklist) : [];
  const labels = task.labels ? task.labels.split(',') : [];
  const attachments = task.attachments ? JSON.parse(task.attachments) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            <h2>{task.title}</h2>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-grow">
          <div className="space-y-6 p-4">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className={priorityColors[task.priority]}
              >
                {task.priority}
              </Badge>
              <Badge variant="secondary" className={statusColors[task.status]}>
                {task.status.replace('_', ' ')}
              </Badge>
              {task.due_date && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {formatDistanceToNow(new Date(task.due_date), {
                    addSuffix: true,
                  })}
                </Badge>
              )}
              {task.estimated_time && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Est: {task.estimated_time}h
                </Badge>
              )}
              {task.actual_time && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Actual: {task.actual_time}h
                </Badge>
              )}
              {task.assigned_to && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Assigned: {task.assigned_to}
                </Badge>
              )}
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
                {task.markdown_content && (
                  <TabsTrigger value="content">Content</TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Task Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <dt>Board ID:</dt>
                      <dd>{task.board_id}</dd>
                      <dt>Column ID:</dt>
                      <dd>{task.column_id}</dd>
                      <dt>Order Number:</dt>
                      <dd>{task.order_num}</dd>
                      {task.parent_task_id && (
                        <>
                          <dt>Parent Task ID:</dt>
                          <dd>{task.parent_task_id}</dd>
                        </>
                      )}
                      {task.time_to_complete && (
                        <>
                          <dt>Time to Complete:</dt>
                          <dd>{task.time_to_complete}</dd>
                        </>
                      )}
                    </dl>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="description">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {task.description || 'No description provided.'}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              {task.markdown_content && (
                <TabsContent value="content">
                  <Card>
                    <CardHeader>
                      <CardTitle>Markdown Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm whitespace-pre-wrap">
                        {task.markdown_content}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>

            <Accordion type="multiple" className="w-full space-y-4">
              <AccordionItem value="checklist">
                <AccordionTrigger>
                  Checklist {checklist.length > 0 && `(${checklist.length})`}
                </AccordionTrigger>
                <AccordionContent>
                  {checklist.length > 0 ? (
                    <div className="space-y-2">
                      {checklist.map(
                        (
                          item: { text: string; checked: boolean },
                          index: number
                        ) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              readOnly
                              className="h-4 w-4"
                            />
                            <span className="text-sm">{item.text}</span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <EmptyState message="No checklist items added yet." />
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="labels">
                <AccordionTrigger>
                  Labels {labels.length > 0 && `(${labels.length})`}
                </AccordionTrigger>
                <AccordionContent>
                  {labels.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {labels.map((label, index) => (
                        <Badge key={index} variant="secondary">
                          {label.trim()}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No labels assigned to this task." />
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="attachments">
                <AccordionTrigger>
                  Attachments{' '}
                  {attachments.length > 0 && `(${attachments.length})`}
                </AccordionTrigger>
                <AccordionContent>
                  {attachments.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {attachments.map((attachment: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm">{attachment}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState message="No attachments added to this task." />
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {task.comments_enabled && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState message="Comments are enabled but none have been added yet." />
                </CardContent>
              </Card>
            )}

            <Separator />

            <div className="text-xs text-muted-foreground">
              <p>
                Created: {formatDistanceToNow(new Date(task.created_at))} ago
              </p>
              <p>
                Last updated: {formatDistanceToNow(new Date(task.last_updated))}{' '}
                ago
              </p>
            </div>

            {task.estimated_time && task.actual_time && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Time Progress</p>
                <Progress
                  value={(task.actual_time / task.estimated_time) * 100}
                />
                <p className="text-xs text-muted-foreground">
                  {task.actual_time}h / {task.estimated_time}h
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
