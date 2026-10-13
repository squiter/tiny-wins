import { afterEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { migrate, type MigrationDatabase } from '../../src/database/migrations';
import { sqliteRepository } from '../../src/database/repository';
import * as schema from '../../src/database/schema';
import { createHabit, toggleToday, type Clock } from '../../src/features/check-ins/service';
import {
  editHabit,
  archiveHabit,
  restoreHabit,
  moveHabit,
} from '../../src/features/habits/service';
import { dateKey } from '../../src/domain/calendar';
const directories: string[] = [];
const databases: Database.Database[] = [];
afterEach(() => {
  databases.forEach((db) => {
    if (db.open) db.close();
  });
  directories.forEach((directory) => rmSync(directory, { recursive: true, force: true }));
  databases.length = 0;
  directories.length = 0;
});
function open(path: string) {
  const sqlite = new Database(path);
  databases.push(sqlite);
  const adapter: MigrationDatabase = {
    execSync: (sql) => {
      sqlite.exec(sql);
    },
    getFirstSync: <T>(sql: string) => (sqlite.prepare(sql).get() as T | undefined) ?? null,
    withTransactionSync: (operation) => {
      sqlite.transaction(operation)();
    },
  };
  migrate(adapter);
  return { sqlite, repository: sqliteRepository(drizzle(sqlite, { schema })), adapter };
}
const clock: Clock = {
  now: () => new Date('2024-03-01T01:00:00Z'),
  timezone: () => 'America/Sao_Paulo',
};
describe('real SQLite + shared Drizzle adapter', () => {
  it('upgrades a real v1 file without losing habits, dates or completions', () => {
    const directory = mkdtempSync(join(tmpdir(), 'tiny-wins-v1-'));
    directories.push(directory);
    const path = join(directory, 'old.db');
    const old = new Database(path);
    old.exec(`CREATE TABLE habits (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, color TEXT NOT NULL, starts_on TEXT NOT NULL, created_at TEXT NOT NULL);
      CREATE TABLE completions (habit_id TEXT NOT NULL REFERENCES habits(id), local_date TEXT NOT NULL, timezone TEXT NOT NULL, completed_at TEXT NOT NULL, PRIMARY KEY (habit_id,local_date));
      INSERT INTO habits VALUES ('b','Read','blue','2024-02-29','2024-02-29T01:00:00Z');
      INSERT INTO habits VALUES ('a','Walk','forest','2024-02-28','2024-02-28T01:00:00Z');
      INSERT INTO completions VALUES ('b','2024-02-29','America/Sao_Paulo','2024-03-01T01:00:00Z');
      PRAGMA user_version = 1;`);
    old.close();
    const { repository, sqlite, adapter } = open(path);
    expect(
      repository
        .listHabits()
        .map((habit) => [habit.id, habit.icon, habit.sortOrder, habit.archivedAt]),
    ).toEqual([
      ['a', 'plant', 0, null],
      ['b', 'plant', 1, null],
    ]);
    expect(repository.getHabit('b')?.startsOn).toBe('2024-02-29');
    expect(repository.listCompletions()[0]?.localDate).toBe('2024-02-29');
    migrate(adapter);
    expect(sqlite.prepare('PRAGMA user_version').get()).toEqual({ user_version: 2 });
    sqlite.close();
    expect(open(path).repository.listCompletions()).toHaveLength(1);
  });
  it('edits, orders, archives and restores while preserving history after restart', () => {
    const directory = mkdtempSync(join(tmpdir(), 'tiny-wins-edit-'));
    directories.push(directory);
    const path = join(directory, 'habits.db');
    let connection = open(path);
    createHabit(connection.repository, clock, 'read', 'Read', 'blue', 'book');
    createHabit(connection.repository, clock, 'walk', 'Walk', 'teal', 'walk');
    createHabit(connection.repository, clock, 'water', 'Water', 'blue', 'water');
    toggleToday(connection.repository, clock, 'read');
    const before = connection.repository.listCompletions();
    editHabit(connection.repository, 'read', ' Read a chapter ', 'coral', 'book');
    expect(connection.repository.getHabit('read')).toMatchObject({
      title: 'Read a chapter',
      color: 'coral',
      icon: 'book',
      startsOn: '2024-02-29',
    });
    moveHabit(connection.repository, 'water', -1);
    expect(connection.repository.listHabits().map((h) => h.id)).toEqual(['read', 'water', 'walk']);
    archiveHabit(connection.repository, clock, 'read');
    archiveHabit(connection.repository, clock, 'read');
    expect(() => toggleToday(connection.repository, clock, 'read')).toThrow('not active');
    moveHabit(connection.repository, 'walk', -1);
    expect(
      connection.repository
        .listHabits()
        .filter((h) => !h.archivedAt)
        .map((h) => h.id),
    ).toEqual(['walk', 'water']);
    restoreHabit(connection.repository, 'read');
    restoreHabit(connection.repository, 'read');
    expect(connection.repository.listHabits().map((h) => h.id)).toEqual(['walk', 'water', 'read']);
    connection.sqlite.close();
    connection = open(path);
    expect(connection.repository.listHabits().map((h) => h.id)).toEqual(['walk', 'water', 'read']);
    expect(connection.repository.getHabit('read')?.title).toBe('Read a chapter');
    expect(connection.repository.listCompletions()).toEqual(before);
  });
  it('rejects invalid edits/order without partially updating habits', () => {
    const { repository } = open(':memory:');
    createHabit(repository, clock, 'a', 'Read', 'forest');
    createHabit(repository, clock, 'b', 'Walk', 'teal');
    expect(() => editHabit(repository, 'a', ' ', 'blue', 'book')).toThrow();
    expect(() => editHabit(repository, 'missing', 'Read', 'blue', 'book')).toThrow();
    for (const ids of [['a'], ['a', 'a'], ['a', 'missing'], ['b', 'a', 'extra']])
      expect(() => repository.reorder(ids)).toThrow();
    expect(repository.listHabits().map((h) => [h.id, h.title])).toEqual([
      ['a', 'Read'],
      ['b', 'Walk'],
    ]);
    moveHabit(repository, 'a', -1);
    moveHabit(repository, 'b', 1);
    expect(repository.listHabits().map((h) => h.id)).toEqual(['a', 'b']);
    archiveHabit(repository, clock, 'b');
    expect(() => repository.reorder(['a', 'b'])).toThrow();
    expect(() => moveHabit(repository, 'b', -1)).toThrow();
    repository.reorder(['a']);
  });
  it('keeps recorded dates immutable through midnight and timezone travel', () => {
    const { repository } = open(':memory:');
    createHabit(repository, clock, 'uuid-1', 'Read', 'forest');
    toggleToday(repository, clock, 'uuid-1');
    const nextDay: Clock = {
      now: () => new Date('2024-03-01T04:00:00Z'),
      timezone: clock.timezone,
    };
    toggleToday(repository, nextDay, 'uuid-1');
    expect(
      repository
        .listCompletions()
        .map((row) => row.localDate)
        .sort(),
    ).toEqual(['2024-02-29', '2024-03-01']);
    const travel: Clock = { now: clock.now, timezone: () => 'Asia/Tokyo' };
    toggleToday(repository, travel, 'uuid-1');
    expect(repository.listCompletions().map((row) => row.localDate)).toEqual(['2024-02-29']);
    expect(repository.listCompletions()[0]?.timezone).toBe('America/Sao_Paulo');
  });

  it('creates, completes, closes, reopens and removes a check-in', () => {
    const directory = mkdtempSync(join(tmpdir(), 'tiny-wins-'));
    directories.push(directory);
    const path = join(directory, 'habits.db');
    let connection = open(path);
    createHabit(connection.repository, clock, 'uuid-1', ' Read a page ', 'blue');
    toggleToday(connection.repository, clock, 'uuid-1');
    connection.sqlite.close();
    connection = open(path);
    expect(connection.repository.listHabits()[0]?.title).toBe('Read a page');
    expect(connection.repository.listHabits()[0]?.startsOn).toBe('2024-02-29');
    expect(connection.repository.listCompletions()[0]?.timezone).toBe('America/Sao_Paulo');
    expect(connection.repository.isCompleted('uuid-1', dateKey('2024-02-29'))).toBe(true);
    toggleToday(connection.repository, clock, 'uuid-1');
    expect(connection.repository.listCompletions()).toEqual([]);
    connection.sqlite.close();
    expect(open(path).repository.listCompletions()).toEqual([]);
  });
  it('migrations and explicit completion writes are idempotent; foreign keys enforced', () => {
    const { repository, adapter } = open(':memory:');
    migrate(adapter);
    createHabit(repository, clock, 'uuid-1', 'Read', 'forest');
    const completion = {
      habitId: 'uuid-1',
      localDate: dateKey('2024-02-29'),
      timezone: clock.timezone(),
      completedAt: clock.now().toISOString(),
    };
    repository.setCompleted(completion, true);
    repository.setCompleted(completion, true);
    expect(repository.listCompletions()).toHaveLength(1);
    expect(() => repository.setCompleted({ ...completion, habitId: 'missing' }, true)).toThrow();
    repository.setCompleted(completion, false);
    repository.setCompleted(completion, false);
    expect(repository.listCompletions()).toHaveLength(0);
  });
  it('does not persist invalid titles or duplicate habit identifiers', () => {
    const { repository } = open(':memory:');
    expect(() => createHabit(repository, clock, 'uuid-1', ' ', 'forest')).toThrow();
    expect(repository.listHabits()).toEqual([]);
    createHabit(repository, clock, 'uuid-1', 'Read', 'forest');
    expect(() => createHabit(repository, clock, 'uuid-1', 'Read again', 'forest')).toThrow();
    expect(repository.listHabits()).toHaveLength(1);
  });
  it('rejects unknown future schema without modifying user data', () => {
    const { sqlite, adapter } = open(':memory:');
    sqlite.exec('PRAGMA user_version = 3');
    expect(() => migrate(adapter)).toThrow('newer Tiny Wins');
    expect(sqlite.prepare('PRAGMA user_version').get()).toEqual({ user_version: 3 });
  });
});
