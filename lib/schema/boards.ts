import { pgTable, serial, bigint, text, timestamp, boolean, varchar, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';

export const visibilityEnum = pgEnum('visibility', ['private', 'public', 'team']);
export const boardTypeEnum = pgEnum('board_type', ['kanban', 'scrum', 'scrumban']);

export const boards = pgTable('boards', {
    id: serial('id').primaryKey(),
    userId: bigint({mode: 'number'}).notNull().references(() => users.id),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    lastUpdated: timestamp('last_updated').defaultNow(),
    description: text('description'),
    ownerId: bigint({mode: 'number'}).notNull().references(() => users.id),
    isArchived: boolean('is_archived').default(false),
    visibility: visibilityEnum('visibility').default('private'),
    backgroundColor: varchar('background_color', { length: 7 }).default('#FFFFFF'),
    boardType: boardTypeEnum('board_type').default('kanban'),
    dueDate: timestamp('due_date', { mode: 'date' }),
    labelsEnabled: boolean('labels_enabled').default(true),
    defaultUserRoles: jsonb('default_user_roles'),
});