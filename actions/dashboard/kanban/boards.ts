import Database from '@tauri-apps/plugin-sql';

export interface Board {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  created_at: string;
  last_updated: string;
  owner_id: number;
  is_archived: boolean;
  visibility: 'private' | 'public' | 'team';
  background_color: string;
  board_type: 'kanban' | 'scrum' | 'scrumban';
  due_date?: string;
  labels_enabled: boolean;
  default_user_roles?: string;
}

export interface CreateBoardData {
  user_id: number;
  name: string;
  description?: string;
  owner_id: number;
  visibility?: 'private' | 'public' | 'team';
  background_color?: string;
  board_type?: 'kanban' | 'scrum' | 'scrumban';
  due_date?: string;
}

export async function createBoard(boardData: CreateBoardData): Promise<number> {
  const db = await Database.load('sqlite:kanflow.db');
  const sql = `
        INSERT INTO boards (user_id, name, description, owner_id, visibility, background_color, board_type, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  const result = await db.execute(sql, [
    boardData.user_id,
    boardData.name,
    boardData.description || null,
    boardData.owner_id,
    boardData.visibility || 'private',
    boardData.background_color || '#FFFFFF',
    boardData.board_type || 'kanban',
    boardData.due_date || null,
  ]);
  if (result.lastInsertId === undefined) {
    throw new Error('Failed to create board: no ID was returned');
  }
  return result.lastInsertId;
}

export async function getBoardById(id: number): Promise<Board | null> {
  const db = await Database.load('sqlite:kanflow.db');
  const sql = 'SELECT * FROM boards WHERE id = ?';
  const results = await db.select<Board[]>(sql, [id]);
  return results.length ? results[0] : null;
}

export async function getUserBoards(userId: number): Promise<Board[]> {
  const db = await Database.load('sqlite:kanflow.db');
  const sql =
    'SELECT * FROM boards WHERE user_id = ? AND is_archived = FALSE ORDER BY last_updated DESC';
  return await db.select<Board[]>(sql, [userId]);
}

export async function updateBoard(
  id: number,
  updates: Partial<Board>
): Promise<void> {
  const db = await Database.load('sqlite:kanflow.db');
  const sets = Object.keys(updates)
    .map(key => `${key} = ?`)
    .join(', ');
  const sql = `UPDATE boards SET ${sets}, last_updated = CURRENT_TIMESTAMP WHERE id = ?`;
  const values = [...Object.values(updates), id];
  await db.execute(sql, values);
}

export async function archiveBoard(id: number): Promise<void> {
  const db = await Database.load('sqlite:kanflow.db');
  const sql =
    'UPDATE boards SET is_archived = TRUE, last_updated = CURRENT_TIMESTAMP WHERE id = ?';
  await db.execute(sql, [id]);
}
