'use client';
import { DashboardHeader } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { CreateBoardDialog } from '@/components/dashboard/create-board-dialog';
import { useHotkeys } from 'react-hotkeys-hook';

import { RecentTasks } from '@/components/dashboard/recent-tasks';
import {
  getRecentTasks,
  getTaskStats,
  type RecentTask,
  type TaskStats,
} from '@/actions/dashboard/kanban/tasks';
import { useEffect, useState, useCallback } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);
  const [isCreateBoardDialogOpen, setIsCreateBoardDialogOpen] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  useHotkeys(
    'ctrl+shift+n',
    e => {
      e.preventDefault();
      setIsCreateBoardDialogOpen(true);
    },
    []
  );

  const fetchData = useCallback(async () => {
    setIsRefetching(true);
    try {
      const stats = await getTaskStats(1);
      const recentTasks = await getRecentTasks(1);
      setStats(stats);
      setRecentTasks(recentTasks);
    } finally {
      setIsRefetching(false);
    }
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        text="Manage your tasks and projects"
      >
        <div className="flex items-center gap-2">
          <CreateBoardDialog
            open={isCreateBoardDialogOpen}
            onOpenChange={setIsCreateBoardDialogOpen}
            onBoardCreated={() => {
              // Refresh stats after board creation
              fetchData();
            }}
          >
            <Button onClick={() => setIsCreateBoardDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Board
            </Button>
          </CreateBoardDialog>
          <Button variant='ghost' onClick={fetchData} disabled={isRefetching}>
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
            <CardDescription>Tasks in progress</CardDescription>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className="text-2xl font-bold">{stats.active_tasks}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
            <CardDescription>Successfully finished tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className="text-2xl font-bold">{stats.completed_tasks}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Boards</CardTitle>
            <CardDescription>Active project boards</CardDescription>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className="text-2xl font-bold">{stats.total_boards}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <RecentTasks tasks={recentTasks} />
    </>
  );
}
