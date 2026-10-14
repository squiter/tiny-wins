import { and, asc, eq } from 'drizzle-orm';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import type { HabitRepository } from '../features/habits/repository';
import type { PreferencesRepository } from '../features/preferences/repository';
import { validateWeekStart } from '../domain/preferences';
import * as schema from './schema';
import { validateHabitOrder } from '../domain/habit';

export function sqliteRepository(
  db: BaseSQLiteDatabase<'sync', unknown, typeof schema>,
): HabitRepository & PreferencesRepository {
  const repository: HabitRepository & PreferencesRepository = {
    getWeekStartsOn: () =>
      validateWeekStart(
        db.select().from(schema.preferences).where(eq(schema.preferences.id, 1)).get()
          ?.weekStartsOn ?? 1,
      ),
    setWeekStartsOn: (value) => {
      const weekStartsOn = validateWeekStart(value);
      db.insert(schema.preferences)
        .values({ id: 1, weekStartsOn })
        .onConflictDoUpdate({ target: schema.preferences.id, set: { weekStartsOn } })
        .run();
    },
    listHabits: () =>
      readPages(
        (offset) =>
          db
            .select()
            .from(schema.habits)
            .orderBy(
              asc(schema.habits.sortOrder),
              asc(schema.habits.createdAt),
              asc(schema.habits.id),
            )
            .limit(20)
            .offset(offset)
            .all(),
        20,
      ),
    listCompletions: () =>
      readPages((offset) =>
        db
          .select()
          .from(schema.completions)
          .orderBy(asc(schema.completions.habitId), asc(schema.completions.localDate))
          .limit(100)
          .offset(offset)
          .all(),
      ),
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
    mergeBackup: (backup) =>
      db.transaction(() => {
        const existing = new Map(repository.listHabits().map((habit) => [habit.id, habit]));
        const wins = new Set(
          repository.listCompletions().map((win) => `${win.habitId}:${win.localDate}`),
        );
        let habitsAdded = 0;
        let winsAdded = 0;
        let sortOrder =
          Math.max(-1, ...Array.from(existing.values(), (habit) => habit.sortOrder)) + 1;
        for (const habit of backup.habits) {
          const current = existing.get(habit.id);
          if (current && current.startsOn !== habit.startsOn)
            throw new Error('This backup conflicts with existing habit history.');
          if (!current) {
            db.insert(schema.habits)
              .values({ ...habit, sortOrder: sortOrder++ })
              .run();
            existing.set(habit.id, habit);
            habitsAdded += 1;
          }
        }
        for (const completion of backup.completions) {
          if (
            !existing.has(completion.habitId) ||
            completion.localDate < existing.get(completion.habitId)!.startsOn
          )
            throw new Error('This backup contains an invalid win.');
          const key = `${completion.habitId}:${completion.localDate}`;
          if (!wins.has(key)) {
            db.insert(schema.completions).values(completion).run();
            wins.add(key);
            winsAdded += 1;
          }
        }
        return { habitsAdded, winsAdded };
      }),
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

// Keep worker responses bounded on web; native storage uses the same query path.
function readPages<T>(read: (offset: number) => T[], pageSize = 100): T[] {
  const records: T[] = [];
  for (let offset = 0; ; offset += pageSize) {
    const page = read(offset);
    records.push(...page);
    if (page.length < pageSize) return records;
  }
}
