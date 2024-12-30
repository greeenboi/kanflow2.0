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
  LoaderPinwheel,
  PlusCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Comment, Task } from '@/actions/dashboard/kanban/tasks';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ListTodo, FileText, FileCode } from 'lucide-react';
import { type Board, getBoardById } from '@/actions/dashboard/kanban/boards';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from 'lucide-react';
import { updateTask, getTaskComments, addComment } from '@/actions/dashboard/kanban/tasks';
import { LabelSelector } from './label-selector';
import { getUser } from '@/lib/store/userStore';
import type { User as UserType } from '@/lib/db/actions';
import { getUserById } from '@/lib/db/actions';

type ColumnId = 1 | 2 | 3;
type ColumnInfo = {
  name: string;
  class: string;
};
type ColumnMap = {
  [K in ColumnId]: ColumnInfo;
};

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

type CommentWithUserName = Comment & {
  user_name?: string;
};

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
  const [boardName, setBoardName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    checklist: { text: string; checked: boolean; }[];
    labels: string[];
    attachments: number[]; 
    description: string;
    markdown_content?: string;
  }>({
    checklist: [],
    labels: [],
    attachments: [],
    description: '',
    markdown_content: '',
  });

  const [checklistProgress, setChecklistProgress] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
  });

  const [comments, setComments] = useState<CommentWithUserName[]>([]);
  const [newCommentText, setNewCommentText] = useState('');

  // Add this function to calculate checklist progress
  const updateChecklistProgress = useCallback((checklist: { checked: boolean }[]) => {
    const total = checklist.length;
    const completed = checklist.filter(item => item.checked).length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    setChecklistProgress({ completed, total, percentage });
  }, []);

  const getBoardName = useCallback(async (boardId: Board['id']) => {
    setIsLoading(true);
    try {
      const data = await getBoardById(boardId);
      if (!data) {
        toast.error('Failed to get board name', {
          description: "Refetch the data?",
          action: {
            label: "Retry",
            onClick: () => getBoardName(boardId)
          }
        });
      } else {
        setBoardName(data.name);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (task?.board_id) {
      getBoardName(task.board_id);
    }
  }, [task?.board_id, getBoardName]);

  useEffect(() => {
    if (task) {
      const checklist = task.checklist ? JSON.parse(task.checklist) : [];
      setEditValues({
        checklist,
        labels: task.labels || [],
        attachments: task.attachments || [],
        description: task.description || '',
        markdown_content: task.markdown_content,
      });
      updateChecklistProgress(checklist);
    }
  }, [task, updateChecklistProgress]);

  useEffect(() => {
    async function loadComments() {
      if (task) {
        const fetchedComments = await getTaskComments(task.id);
        const withUserNames = await Promise.all(
          fetchedComments.map(async (comment) => {
            const userData = await getUserById(comment.user_id);
            return {
              ...comment,
              user_name: userData ? userData.name : 'Unknown user',
            };
          })
        );
        setComments(withUserNames);
      }
    }
    if (open && task) {
      loadComments();
    }
  }, [open, task]);

  if (!task) return null;

  const columnNames: ColumnMap = {
    1: { name: "To Do", class: "bg-gray-100 text-gray-800" },
    2: { name: "In Progress", class: "bg-yellow-100 text-yellow-800" },
    3: { name: "Done", class: "bg-green-100 text-green-800" },
  } as const;

  // Helper function to safely get column info
  const getColumnInfo = (columnId: number): ColumnInfo => {
    return columnNames[columnId as ColumnId] || { 
      name: `Column ${columnId}`, 
      class: "bg-gray-100 text-gray-800" 
    };
  };

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

  const labels = task.labels || [];
  const attachments = task.attachments || [];

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleUpdate = async (field: string, value: any) => {
    if (!task) return;

    try {
      let updateValue = value;
      if (field === 'checklist' || field === 'attachments' || field === 'labels') {
        updateValue = JSON.stringify(value);
      }

      await updateTask(task.id, { [field]: updateValue });
      setEditingField(null);
      toast.success('Updated successfully');
    } catch (error) {
      toast.error('Failed to update');
      console.error(error);
    }
  };

  async function handleAddComment() {
    const user = await getUser();
    if (!task || !newCommentText.trim() || !user?.id) return;
    try {
      await addComment({
        task_id: task.id,
        user_id: user.id,
        content: newCommentText,
      });
      setNewCommentText('');
      const updatedComments = await getTaskComments(task.id);
      setComments(updatedComments);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }

  // Add these helper components
  const EditableField = ({ 
    field, 
    value, 
    onSave 
  }: { 
    field: string; 
    value: string; 
    onSave: (value: string) => void;
  }) => {
    const [editValue, setEditValue] = useState(value);
    
    return editingField === field ? (
      <div className="flex gap-2">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="flex-1"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSave(editValue)}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditingField(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    ) : (
      <div className="flex justify-between items-center">
        <span>{value || 'None'}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditingField(field)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Update the existing components to use the new editing functionality
  // Example for Checklist:
  const renderChecklist = () => (
    <AccordionItem value="checklist">
      <AccordionTrigger className="flex items-center">
        <div className="flex items-center gap-2">
          Checklist
          {checklistProgress.total > 0 && (
            <Badge variant="secondary" className="bg-primary/15">
              {checklistProgress.completed}/{checklistProgress.total}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {checklistProgress.total > 0 && (
          <div className="mb-4">
            <Progress value={checklistProgress.percentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(checklistProgress.percentage)}% complete
            </p>
          </div>
        )}
        {editValues.checklist.length > 0 ? (
          <div className="space-y-2">
            {editValues.checklist.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => {
                    const newChecklist = [...editValues.checklist];
                    newChecklist[index].checked = !item.checked;
                    setEditValues({ ...editValues, checklist: newChecklist });
                    updateChecklistProgress(newChecklist);
                    handleUpdate('checklist', newChecklist);
                  }}
                  className="h-4 w-4"
                />
                {editingField === `checklist-${index}` ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={item.text}
                      onChange={(e) => {
                        const newChecklist = [...editValues.checklist];
                        newChecklist[index].text = e.target.value;
                        setEditValues({ ...editValues, checklist: newChecklist });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleUpdate('checklist', editValues.checklist);
                        setEditingField(null);
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingField(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm">{item.text}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingField(`checklist-${index}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No checklist items added yet." />
        )}
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full"
          onClick={(e) => {
            e.stopPropagation();
            const newChecklist = [...editValues.checklist, { text: '', checked: false }];
            setEditValues({ ...editValues, checklist: newChecklist });
            setEditingField('checklist-new');
          }}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[750px] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            <h2>{task.title}</h2>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-grow overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent">
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

            <Tabs defaultValue="details" orientation="vertical" className="flex w-full gap-2">
              <TabsList className="flex-col h-auto">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <TabsTrigger value="details" className="py-3">
                          <ListTodo size={16} strokeWidth={2} aria-hidden="true" />
                        </TabsTrigger>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="px-2 py-1 text-xs">
                      Details
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <TabsTrigger value="description" className="py-3">
                          <FileText size={16} strokeWidth={2} aria-hidden="true" />
                        </TabsTrigger>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="px-2 py-1 text-xs">
                      Description
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {task.markdown_content && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <TabsTrigger value="content" className="py-3">
                            <FileCode size={16} strokeWidth={2} aria-hidden="true" />
                          </TabsTrigger>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="px-2 py-1 text-xs">
                        Content
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TabsList>
              <div className="grow rounded-lg">
                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>Task Details</CardTitle>
                    </CardHeader>
                    <CardContent>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Board</TableHead>
                          <TableHead className="w-[200px]">Column</TableHead>
                          <TableHead>Priority</TableHead>
                          {task.parent_task_id && ( 
                            <TableHead>Parent Task</TableHead>
                          )}
                          {task.estimated_time && <TableCell className="font-medium">Time to Complete</TableCell>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <LoaderPinwheel className="h-4 w-4 animate-spin" />
                                <span>Loading...</span>
                              </div>
                            ) : boardName || `Board ${task.board_id}`}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={getColumnInfo(task.column_id).class}
                            >
                              {getColumnInfo(task.column_id).name}
                            </Badge>
                          </TableCell>
                          <TableCell>#{task.order_num}</TableCell>
                          {task.parent_task_id &&  <TableCell>#{task.parent_task_id}</TableCell>}
                          <TableCell>{task.estimated_time}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                      
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="description">
                  <Card>
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <EditableField
                        field="description"
                        value={editValues.description}
                        onSave={(value) => handleUpdate('description', value)}
                      />
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
                        <EditableField
                          field="markdown_content"
                          value={editValues.markdown_content || ''}
                          onSave={(value) => handleUpdate('markdown_content', value)}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </div>
            </Tabs>

            <Accordion type="multiple" className="w-full space-y-4">
              {renderChecklist()}

              <AccordionItem value="labels">
                <AccordionTrigger>
                  Labels {labels.length > 0 && `(${labels.length})`}
                </AccordionTrigger>
                <AccordionContent>
                  <LabelSelector
                    selectedLabels={editValues.labels}
                    onLabelsChange={(newLabels) => {
                      setEditValues({ ...editValues, labels: newLabels });
                      handleUpdate('labels', newLabels);
                    }}
                  />
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
                      {attachments.map((attachmentId: number, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm">Attachment #{attachmentId}</span>
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
                  {comments.length === 0 ? (
                    <EmptyState message="No comments added yet." />
                  ) : (
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <div key={comment.id} className="p-2 border rounded">
                          <p className="text-sm mb-1">{comment.content}</p>
                          <p className="text-xs text-muted-foreground">
                            Posted by {comment.user_name} on {comment.created_at}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <Input
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Add a comment..."
                    />
                    <Button onClick={handleAddComment}>Post</Button>
                  </div>
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

