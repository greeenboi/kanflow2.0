import Database from '@tauri-apps/plugin-sql';

export type TaskStatus =
  | 'todo'
  | 'in_progress'
  | 'done'
  | 'blocked'
  | 'archived';

export interface Task {
  id: number;
  board_id: number;
  title: string;
  description?: string;
  assigned_to?: number;
  markdown_content?: string;
  time_to_complete?: string;
  created_at: string;
  last_updated: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: TaskStatus;
  labels?: string;
  comments_enabled: boolean;
  attachments?: string;
  checklist?: string;
  parent_task_id?: number;
  estimated_time?: number;
  actual_time?: number;
  order_num: number;
  column_id: number;
}

export interface CreateTaskData {
  board_id: number;
  title: string;
  description?: string;
  assigned_to?: number;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  column_id: number;
}

export interface TaskStats {
  active_tasks: number;
  completed_tasks: number;
  total_boards: number;
}

export interface RecentTask {
  id: number;
  title: string;
  board_id: number;
  status: string;
  created_at: string;
}

export interface TasksByDate {
  id: number;
  title: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  board_id: number;
}

export async function createTask(taskData: CreateTaskData): Promise<number> {
  const db = await Database.load('sqlite:kanflow.db');
  // Get the highest order_num for the column and add 1
  const orderResult = await db.select<[{ max_order: number }]>(
    'SELECT COALESCE(MAX(order_num), 0) as max_order FROM tasks WHERE column_id = ?',
    [taskData.column_id]
  );
  const newOrderNum = (orderResult[0]?.max_order || 0) + 1;

  const sql = `
        INSERT INTO tasks (
            board_id, title, description, assigned_to, 
            due_date, priority, status, column_id, order_num
        )
        VALUES (?, ?, ?, ?, ?, ?, 'todo', ?, ?)
    `;
  const result = await db.execute(sql, [
    taskData.board_id,
    taskData.title,
    taskData.description || null,
    taskData.assigned_to || null,
    taskData.due_date || null,
    taskData.priority || 'medium',
    taskData.column_id,
    newOrderNum,
  ]);
  if (result.lastInsertId === undefined) {
    throw new Error('Failed to create board: no ID was returned');
  }
  return result.lastInsertId;
}

export async function getTasksByBoard(boardId: number): Promise<Task[]> {
  const db = await Database.load('sqlite:kanflow.db');
  const sql = `
        SELECT * FROM tasks 
        WHERE board_id = ? AND status != 'archived'
        ORDER BY column_id, order_num
    `;
  return await db.select<Task[]>(sql, [boardId]);
}

export async function updateTask(
  id: number,
  updates: Partial<Task>
): Promise<void> {
  const db = await Database.load('sqlite:kanflow.db');
  const sets = Object.keys(updates)
    .map(key => `${key} = ?`)
    .join(', ');
  const sql = `UPDATE tasks SET ${sets}, last_updated = CURRENT_TIMESTAMP WHERE id = ?`;
  const values = [...Object.values(updates), id];
  await db.execute(sql, values);
}

export async function moveTask(
  taskId: number,
  newColumnId: number,
  newOrderNum: number,
  newStatus: TaskStatus
): Promise<void> {
  const db = await Database.load('sqlite:kanflow.db');
  const sql = `
    UPDATE tasks 
    SET column_id = ?, 
        order_num = ?, 
        status = ?,
        last_updated = CURRENT_TIMESTAMP 
    WHERE id = ?
  `;
  await db.execute(sql, [newColumnId, newOrderNum, newStatus, taskId]);
}

export async function archiveTask(id: number): Promise<void> {
  const db = await Database.load('sqlite:kanflow.db');
  const sql =
    "UPDATE tasks SET status = 'archived', last_updated = CURRENT_TIMESTAMP WHERE id = ?";
  await db.execute(sql, [id]);
}

export async function getTaskStats(userId: number): Promise<TaskStats> {
  const db = await Database.load('sqlite:kanflow.db');

  const stats = await db.select<TaskStats[]>(`
    SELECT 
      (SELECT COUNT(*) FROM tasks WHERE status = 'in_progress') as active_tasks,
      (SELECT COUNT(*) FROM tasks WHERE status = 'done') as completed_tasks,
      (SELECT COUNT(*) FROM boards WHERE is_archived = FALSE) as total_boards
  `);

  return stats[0];
}

export async function getRecentTasks(
  userId: number,
  limit = 6
): Promise<RecentTask[]> {
  const db = await Database.load('sqlite:kanflow.db');

  return await db.select<RecentTask[]>(
    `
    SELECT id, title, status, created_at, board_id
    FROM tasks 
    WHERE status != 'archived'
    ORDER BY created_at DESC 
    LIMIT ?
  `,
    [limit]
  );
}

export async function getTasksByDueDate(date: string): Promise<TasksByDate[]> {
  const db = await Database.load('sqlite:kanflow.db');
  return await db.select<TasksByDate[]>(
    `
    SELECT id, title, due_date, priority, board_id
    FROM tasks 
    WHERE date(due_date) = date(?)
    AND status != 'done' 
    AND status != 'archived'
    ORDER BY priority DESC
  `,
    [date]
  );
}
