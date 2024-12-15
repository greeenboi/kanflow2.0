import { pgTable, serial, bigint, text, timestamp, boolean, varchar, jsonb, integer, interval, check, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { boards } from './boards';

export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'urgent']);
export const statusEnum = pgEnum('status', ['todo', 'in_progress', 'done', 'blocked', 'archived']);
// @ts-expect-error smth about types and not referencing the table~~
export const tasks = pgTable('tasks', {
    id: serial('id').primaryKey(),
    boardId: bigint({mode: 'number'}).notNull().references(() => boards.id),
    title: text('title').notNull(),
    description: text('description'),
    assignedTo: bigint({mode: 'number'}).references(() => users.id),
    markdownContent: text('markdown_content'),
    timeToComplete: interval('time_to_complete'),
    createdAt: timestamp('created_at').defaultNow(),
    lastUpdated: timestamp('last_updated').defaultNow(),
    dueDate: timestamp('due_date', { mode: 'date' }),
    priority: priorityEnum('priority').default('medium'),
    status: statusEnum('status').default('todo'),
    labels: varchar('labels', { length: 255 }),
    commentsEnabled: boolean('comments_enabled').default(true),
    attachments: jsonb('attachments'),
    checklist: jsonb('checklist'),
    // @ts-expect-error idek bro
    parentTaskId: bigint({mode: 'number'}).references(() => tasks.id),
    estimatedTime: integer('estimated_time'),
    actualTime: integer('actual_time'),
    order: integer('order'),
    columnId: bigint({mode: 'number'}),
});