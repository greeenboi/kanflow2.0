import Database from '@tauri-apps/plugin-sql';
// when using `"withGlobalTauri": true`, you may use
// const Database = window.__TAURI__.sql;

// Define interfaces matching the database schema
export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
}

export interface CreateUserData {
  username: string;
  password: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
}

export async function createUser(userData: CreateUserData): Promise<void> {
  const db = await Database.load('sqlite:kanflow.db');
  const sql = `
    INSERT INTO users (username, password, name, first_name, last_name, email)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [
    userData.username,
    userData.password,
    userData.name,
    userData.first_name || null,
    userData.last_name || null,
    userData.email,
  ];
  const res = await db.execute(sql, params);
  if (!res) {
    throw new Error('Failed to create user');
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await Database.load('sqlite:kanflow.db');
  const sql = `
    SELECT * FROM users WHERE email = ?
  `;
  const params = [email];
  const results = await db.select<User[]>(sql, params);
  return results.length ? results[0] : null;
}

export async function getUserById(id: number): Promise<User | null> {
  const db = await Database.load('sqlite:kanflow.db');
  const sql = 'SELECT * FROM users WHERE id = ?';
  const results = await db.select<User[]>(sql, [id]);
  return results.length ? results[0] : null;
}

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  const db = await Database.load('sqlite:kanflow.db');
  const sql = 'SELECT * FROM users WHERE username = ?';
  const results = await db.select<User[]>(sql, [username]);
  return results.length ? results[0] : null;
}

export async function updateUser(userData: User): Promise<void> {
  const db = await Database.load('sqlite:kanflow.db');
  const sql = `
    UPDATE users
    SET username = ?, name = ?, first_name = ?, last_name = ?, email = ?
    WHERE id = ?
  `;
  const params = [
    userData.username,
    // Do not update password
    userData.name,
    userData.first_name || null,
    userData.last_name || null,
    userData.email,
    userData.id,
  ];
  const res = await db.execute(sql, params);
  if (!res) {
    throw new Error('Failed to update user');
  }
}