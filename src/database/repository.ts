import { and, asc, eq } from 'drizzle-orm';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import type { HabitRepository } from '../features/habits/repository';
import * as schema from './schema';
import { validateHabitOrder } from '../domain/habit';

export function sqliteRepository(
  db: BaseSQLiteDatabase<'sync', unknown, typeof schema>,
): HabitRepository {
  const repository: HabitRepository = {
    listHabits: () =>
      db
        .select()
        .from(schema.habits)
        .orderBy(asc(schema.habits.sortOrder), asc(schema.habits.createdAt), asc(schema.habits.id))
        .all(),
    listCompletions: () => db.select().from(schema.completions).all(),
    getHabit: (id) => db.select().from(schema.habits).where(eq(schema.habits.id, id)).get(),
    update: (id, changes) => {
      db.update(schema.habits).set(changes).where(eq(schema.habits.id, id)).run();
    },
    setArchived: (id, archivedAt, schedule) => {
      db.transaction(() => {
        const changes =
          archivedAt === null
            ? {
                archivedAt,
                schedule,
                sortOrder:
                  Math.max(
                    -1,
                    ...repository
                      .listHabits()
                      .filter((habit) => !habit.archivedAt)
                      .map((habit) => habit.sortOrder),
                  ) + 1,
              }
            : { archivedAt, schedule };
        db.update(schema.habits).set(changes).where(eq(schema.habits.id, id)).run();
      });
    },
    reorder: (ids) => {
      db.transaction(() => {
        validateHabitOrder(repository.listHabits(), ids);
        ids.forEach((id, sortOrder) =>
          db.update(schema.habits).set({ sortOrder }).where(eq(schema.habits.id, id)).run(),
        );
      });
    },
    create: (habit) => {
      db.insert(schema.habits).values(habit).run();
    },
    isCompleted: (habitId, day) =>
      !!db
        .select()
        .from(schema.completions)
        .where(and(eq(schema.completions.habitId, habitId), eq(schema.completions.localDate, day)))
        .get(),
    setCompleted: (completion, completed) => {
      if (completed) db.insert(schema.completions).values(completion).onConflictDoNothing().run();
      else
        db.delete(schema.completions)
          .where(
            and(
              eq(schema.completions.habitId, completion.habitId),
              eq(schema.completions.localDate, completion.localDate),
            ),
          )
          .run();
    },
  };
  return repository;
}
