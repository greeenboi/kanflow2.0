'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertTriangleIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CalendarIcon,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Task } from '@/actions/dashboard/kanban/tasks';
import type { TaskFormData } from '@/types/kanban';
import { Separator } from '../ui/separator';
import { Checkbox } from '@radix-ui/react-checkbox';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { PopoverPortal } from '@radix-ui/react-popover';

const timeOptions = Array.from({ length: 49 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? '00' : '30';
  const value = `${hours}.${minutes}`;
  const label = `${hours}:${minutes}`;
  return { label, value };
});

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  due_date: z.date().optional(),
  estimated_time: z.string().optional(),
  markdown_content: z.string().optional(),
  time_to_complete: z.string().optional(),
  checklist: z
    .array(
      z.object({
        text: z.string(),
        checked: z.boolean(),
      })
    )
    .optional(),
});

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSave: (data: TaskFormData) => Promise<void>;
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  onSave,
}: TaskDialogProps) {
  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      due_date: task?.due_date ? new Date(task.due_date) : undefined,
      estimated_time: task?.estimated_time?.toString() || '',
      markdown_content: task?.markdown_content || '',
      time_to_complete: task?.time_to_complete || '',
      checklist: task?.checklist ? JSON.parse(task.checklist) : [],
    },
  });

  async function onSubmit(data: z.infer<typeof taskFormSchema>) {
    const formData = {
      ...data,
      estimated_time: data.estimated_time
        ? Number.parseFloat(data.estimated_time)
        : undefined,
    };
    await onSave(formData);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {task ? 'Edit Task' : 'Create Task'}
          </DialogTitle>
          <DialogDescription>
            {task
              ? 'Make changes to your task here.'
              : 'Add a new task to your list.'}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="text-lg"
                        placeholder="Enter task title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter task description"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">
                          <span className="flex items-center">
                            <ArrowDownIcon className="mr-2 h-4 w-4 text-blue-500" />
                            Low
                          </span>
                        </SelectItem>
                        <SelectItem value="medium">
                          <span className="flex items-center">
                            <ArrowRightIcon className="mr-2 h-4 w-4 text-green-500" />
                            Medium
                          </span>
                        </SelectItem>
                        <SelectItem value="high">
                          <span className="flex items-center">
                            <ArrowUpIcon className="mr-2 h-4 w-4 text-orange-500" />
                            High
                          </span>
                        </SelectItem>
                        <SelectItem value="urgent">
                          <span className="flex items-center">
                            <AlertTriangleIcon className="mr-2 h-4 w-4 text-red-500" />
                            Urgent
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="row-span-2 flex flex-col items-center">
                    <FormLabel className=" w-full text-left">
                      Due Date
                    </FormLabel>
                    <FormControl>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="border rounded-md"
                        disabled={date =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimated_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Time</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            // biome-ignore lint/a11y/useSemanticElements: <explanation>
                            role="combobox"
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? `${
                                  timeOptions.find(
                                    time => time.value === field.value
                                  )?.label
                                } hours`
                              : 'Select time'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverPortal>
                        {/* This had gotta be the wierdest code i've ever written, for the future me for ref, 
                        don't remove the popover content wrapping hte popover content. it will mess up the inputs */}
                        {/* <PopoverContent className='bg-transparent border-none shadow-none'> */}
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search time..." />
                            <CommandList>
                              <CommandEmpty>No time found.</CommandEmpty>
                              <CommandGroup>
                                {timeOptions.map(time => (
                                  <CommandItem
                                    value={time.label}
                                    key={time.value}
                                    onSelect={() => {
                                      form.setValue(
                                        'estimated_time',
                                        time.value
                                      );
                                    }}
                                  >
                                    {time.label} hours
                                    <Check
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        time.value === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                        {/* </PopoverContent> */}
                      </PopoverPortal>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* to be added */}
              {/* <FormField
                control={form.control}
                name="is_recurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Recurring Task</FormLabel>
                      <FormDescription>
                        Set this task to repeat on a schedule
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              /> */}
            </div>

            <Separator />

            <div className="space-y-4">
              {/* to be added */}
              {/* <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        {field.value?.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-2"
                              onClick={() => {
                                const newTags = [...field.value!];
                                newTags.splice(index, 1);
                                field.onChange(newTags);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </Badge>
                        ))}
                        <Input
                          placeholder="Add a tag"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.currentTarget;
                              const newTag = input.value.trim();
                              if (newTag && !field.value?.includes(newTag)) {
                                field.onChange([...(field.value || []), newTag]);
                                input.value = '';
                              }
                            }
                          }}
                          className="w-auto flex-grow"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="checklist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Checklist</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {field.value?.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              checked={item.checked}
                              onCheckedChange={checked => {
                                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                                const newChecklist = [...field.value!];
                                newChecklist[index].checked =
                                  checked as boolean;
                                field.onChange(newChecklist);
                              }}
                            />
                            <Input
                              value={item.text}
                              onChange={e => {
                                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                                const newChecklist = [...field.value!];
                                newChecklist[index].text = e.target.value;
                                field.onChange(newChecklist);
                              }}
                              className="flex-grow"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                                const newChecklist = [...field.value!];
                                newChecklist.splice(index, 1);
                                field.onChange(newChecklist);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            field.onChange([
                              ...(field.value || []),
                              { text: '', checked: false },
                            ]);
                          }}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
