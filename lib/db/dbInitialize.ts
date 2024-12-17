import { drizzle } from 'drizzle-orm/pglite';
import { join } from '@tauri-apps/api/path';
import { appDataDir, resolve } from '@tauri-apps/api/path';
import { mkdir, exists } from '@tauri-apps/plugin-fs';

async function initializeDb() {
    const appData = await appDataDir();
    const dbPath = await join(appData, 'database');
    
    // Ensure database directory exists
    const dirExists = await exists(dbPath);
    if (!dirExists) {
        await mkdir(dbPath, { recursive: true });
    }

    return drizzle({
        connection: {
            dataDir: dbPath
        },
        logger: true
    });
}

let dbInstance: ReturnType<typeof drizzle>;

export async function getDb() {
    if (!dbInstance) {
        dbInstance = await initializeDb();
    }
    return dbInstance;
}

// Temporary export for compatibility - replace usages gradually
export const db = drizzle({
    connection: {
        dataDir: './database'
    },
    logger: true
});