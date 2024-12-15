import { drizzle } from 'drizzle-orm/pglite';
import { join } from '@tauri-apps/api/path';
import getAppDataDir from '@/hooks/get-appdata-directory';

// async function initializeDb() {
// 	const dbDir = await join(await getAppDataDir(), 'db');
// 	return drizzle({ connection: { dataDir: dbDir }});
// }

// let db: Awaited<ReturnType<typeof initializeDb>>;

// export default async function getDb() {
// 	if (!db) {
// 		db = await initializeDb();
// 	}
// 	return db;
// }

const db = drizzle({ connection: { dataDir: './Database/' }});