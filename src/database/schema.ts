import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import type { ColorKey, IconKey } from '../domain/habit';
import type { ScheduleVersion } from '../domain/schedule';
import type { WeekStartsOn } from '../domain/preferences';
import type { LocalDate } from '../domain/calendar';
export const habits = sqliteTable('habits', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  color: text('color').$type<ColorKey>().notNull(),
  icon: text('icon').$type<IconKey>().notNull().default('plant'),
  archivedAt: text('archived_at'),
  sortOrder: integer('sort_order').notNull().default(0),
  startsOn: text('starts_on').$type<LocalDate>().notNull(),
  createdAt: text('created_at').notNull(),
  schedule: text('schedule', { mode: 'json' }).$type<ScheduleVersion[]>().notNull(),
});
export const completions = sqliteTable(
  'completions',
  {
    habitId: text('habit_id')
      .notNull()
      .references(() => habits.id, { onDelete: 'cascade' }),
    localDate: text('local_date').$type<LocalDate>().notNull(),
    timezone: text('timezone').notNull(),
    completedAt: text('completed_at').notNull(),
  },
  (table) => [primaryKey({ columns: [table.habitId, table.localDate] })],
);

export const preferences = sqliteTable('preferences', {
  id: integer('id').primaryKey(),
  weekStartsOn: integer('week_starts_on').$type<WeekStartsOn>().notNull().default(1),
});
