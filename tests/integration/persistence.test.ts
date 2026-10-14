import { saveDayNote } from '../../src/features/habits/notes';
import { afterEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { migrate, type MigrationDatabase } from '../../src/database/migrations';
import { sqliteRepository } from '../../src/database/repository';
import * as schema from '../../src/database/schema';
import {
  createHabit,
  toggleToday,
  setDayCompletion,
  type Clock,
} from '../../src/features/check-ins/service';
import {
  editHabit,
  archiveHabit,
  restoreHabit,
  moveHabit,
} from '../../src/features/habits/service';
import { parseBackup, serializeBackup } from '../../src/domain/backup';
import { currentStreak, calendarCells } from '../../src/domain/habit';
import { allWeekdays, plannedTolerance } from '../../src/domain/schedule';
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
  it('migrates v4 without rewriting wins, saves independent notes and reopens/merges atomically', () => {
    const directory = mkdtempSync(join(tmpdir(), 'tiny-wins-notes-'));
    directories.push(directory);
    const path = join(directory, 'notes.db');
    let connection = open(path);
    createHabit(connection.repository, clock, 'read', 'Read', 'coral', 'book');
    toggleToday(connection.repository, clock, 'read');
    const wins = connection.repository.listCompletions();
    connection.sqlite.exec('DROP TABLE notes; PRAGMA user_version = 4');
    connection.sqlite.close();
    connection = open(path);
    expect(connection.repository.listCompletions()).toEqual(wins);
    expect(connection.repository.listNotes()).toEqual([]);
    const day = dateKey('2024-02-29');
    saveDayNote(connection.repository, clock, 'read', day, '  First chapter 🌱  ');
    saveDayNote(connection.repository, clock, 'read', day, 'A newer note');
    expect(connection.repository.listNotes()).toHaveLength(1);
    expect(connection.repository.listCompletions()).toEqual(wins);
    toggleToday(connection.repository, clock, 'read');
    expect(connection.repository.listNotes()[0]?.text).toBe('A newer note');
    expect(connection.repository.listCompletions()).toEqual([]);
    connection.sqlite.close();
    connection = open(path);
    expect(connection.repository.listNotes()[0]?.localDate).toBe(day);
    expect(connection.repository.listNotes()[0]?.text).toBe('A newer note');
    const backup = parseBackup(
      serializeBackup(
        connection.repository.listHabits(),
        [],
        clock.now(),
        connection.repository.listNotes(),
      ),
    );
    const target = open(join(directory, 'restore.db'));
    expect(target.repository.mergeBackup(backup)).toEqual({
      habitsAdded: 1,
      winsAdded: 0,
      notesAdded: 1,
    });
    saveDayNote(target.repository, clock, 'read', day, 'Keep my local edit');
    expect(target.repository.mergeBackup(backup)).toEqual({
      habitsAdded: 0,
      winsAdded: 0,
      notesAdded: 0,
    });
    expect(target.repository.listNotes()[0]?.text).toBe('Keep my local edit');
    const invalid = {
      ...backup,
      habits: [{ ...backup.habits[0]!, id: 'new' }],
      notes: [{ ...backup.notes[0]!, habitId: 'missing' }],
    };
    expect(() => target.repository.mergeBackup(invalid)).toThrow('invalid note');
    expect(target.repository.getHabit('new')).toBeUndefined();
    archiveHabit(connection.repository, clock, 'read');
    expect(() => saveDayNote(connection.repository, clock, 'read', day, 'No')).toThrow();
    expect(connection.repository.listNotes()).toHaveLength(1);
    restoreHabit(connection.repository, 'read', clock);
    saveDayNote(connection.repository, clock, 'read', day, '');
    expect(connection.repository.listNotes()).toEqual([]);
    expect(() =>
      saveDayNote(connection.repository, clock, 'read', dateKey('2024-02-28'), 'No'),
    ).toThrow();
    expect(() =>
      saveDayNote(connection.repository, clock, 'read', dateKey('2024-03-01'), 'No'),
    ).toThrow();
    createHabit(connection.repository, clock, 'rest', 'Rest', 'forest', 'plant', [1]);
    saveDayNote(connection.repository, clock, 'rest', day, 'Rest day context');
    expect(connection.repository.listCompletions()).toEqual([]);
    connection.sqlite.close();
    connection = open(path);
    expect(connection.repository.listNotes()).toEqual([
      {
        habitId: 'rest',
        localDate: day,
        text: 'Rest day context',
        updatedAt: clock.now().toISOString(),
      },
    ]);
  });
  it('reopens renewable tolerance, preserves legacy JSON, carries policy through pause and v2 restore', () => {
    const directory = mkdtempSync(join(tmpdir(), 'tiny-wins-tolerance-'));
    directories.push(directory);
    const path = join(directory, 'habits.db');
    let connection = open(path);
    const first: Clock = { now: () => new Date('2024-02-29T12:00:00Z'), timezone: () => 'UTC' };
    const later: Clock = { now: () => new Date('2024-03-02T12:00:00Z'), timezone: () => 'UTC' };
    createHabit(connection.repository, first, 'read', 'Read', 'coral', 'book', [...allWeekdays], 1);
    createHabit(connection.repository, first, 'strict', 'Strict', 'forest');
    const legacyJson = connection.sqlite
      .prepare('SELECT schedule FROM habits WHERE id=?')
      .get('strict');
    toggleToday(connection.repository, first, 'read');
    toggleToday(connection.repository, later, 'read');
    editHabit(
      connection.repository,
      'read',
      'Read more',
      'coral',
      'book',
      later,
      [...allWeekdays],
      2,
    );
    const schedule = connection.repository.getHabit('read')!.schedule;
    editHabit(
      connection.repository,
      'read',
      'Read more',
      'coral',
      'book',
      later,
      [...allWeekdays],
      2,
    );
    expect(connection.repository.getHabit('read')!.schedule).toEqual(schedule);
    archiveHabit(connection.repository, later, 'read');
    restoreHabit(connection.repository, 'read', later);
    connection.sqlite.close();
    connection = open(path);
    const habit = connection.repository.getHabit('read')!;
    const completions = connection.repository.listCompletions();
    expect(plannedTolerance(habit.schedule)).toBe(2);
    expect(habit.schedule[0]?.streakTolerance).toBe(1);
    expect(currentStreak(habit, completions, dateKey('2024-03-02'))).toBe(2);
    expect(
      calendarCells(
        habit,
        completions,
        dateKey('2024-03-01'),
        dateKey('2024-03-01'),
        dateKey('2024-03-02'),
      )[0]?.state,
    ).toBe('grace');
    expect(
      connection.sqlite.prepare('SELECT schedule FROM habits WHERE id=?').get('strict'),
    ).toEqual(legacyJson);
    expect(connection.sqlite.prepare('PRAGMA user_version').get()).toEqual({ user_version: 5 });
    const backup = parseBackup(
      serializeBackup(connection.repository.listHabits(), completions, later.now()),
    );
    const target = open(join(directory, 'restored.db'));
    expect(target.repository.mergeBackup(backup)).toEqual({
      habitsAdded: 2,
      winsAdded: 2,
      notesAdded: 0,
    });
    target.sqlite.close();
    expect(open(join(directory, 'restored.db')).repository.getHabit('read')?.schedule).toEqual(
      habit.schedule,
    );
  });
  it('adds preferences to a v3 database without moving scheduled wins', () => {
    const directory = mkdtempSync(join(tmpdir(), 'tiny-wins-preferences-'));
    directories.push(directory);
    const path = join(directory, 'preferences.db');
    const first = open(path);
    createHabit(first.repository, clock, 'water', 'Water', 'blue');
    toggleToday(first.repository, clock, 'water');
    const habits = first.repository.listHabits();
    const wins = first.repository.listCompletions();
    first.sqlite.exec('DROP TABLE notes; DROP TABLE preferences; PRAGMA user_version = 3');
    first.sqlite.close();
    const upgraded = open(path);
    expect(upgraded.repository.getWeekStartsOn()).toBe(1);
    upgraded.repository.setWeekStartsOn(0);
    migrate(upgraded.adapter);
    expect(upgraded.repository.listHabits()).toEqual(habits);
    expect(upgraded.repository.listCompletions()).toEqual(wins);
    upgraded.sqlite.close();
    const reopened = open(path);
    expect(reopened.repository.getWeekStartsOn()).toBe(0);
    expect(reopened.repository.listCompletions()).toEqual(wins);
  });
  it('rejects unsupported preferences before writes and at the SQLite boundary', () => {
    const { sqlite, repository } = open(':memory:');
    expect(() => repository.setWeekStartsOn(2 as 0)).toThrow();
    expect(() => sqlite.exec('UPDATE preferences SET week_starts_on = 2')).toThrow();
    expect(() =>
      sqlite.exec('INSERT INTO preferences (id, week_starts_on) VALUES (2, 0)'),
    ).toThrow();
    expect(repository.getWeekStartsOn()).toBe(1);
  });
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
    expect(sqlite.prepare('PRAGMA user_version').get()).toEqual({ user_version: 5 });
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
    restoreHabit(connection.repository, 'read', clock);
    restoreHabit(connection.repository, 'read', clock);
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
  it('persists effective schedules, protects today and rejects ineligible historical writes', () => {
    const directory = mkdtempSync(join(tmpdir(), 'tiny-wins-schedule-'));
    directories.push(directory);
    const path = join(directory, 'habits.db');
    let connection = open(path);
    createHabit(connection.repository, clock, 'read', 'Read', 'blue', 'book');
    toggleToday(connection.repository, clock, 'read');
    editHabit(connection.repository, 'read', 'Read', 'blue', 'book', clock, [1, 3, 5]);
    expect(connection.repository.getHabit('read')?.schedule).toEqual([
      { from: '2024-02-29', days: [0, 1, 2, 3, 4, 5, 6] },
      { from: '2024-03-01', days: [1, 3, 5] },
    ]);
    connection.sqlite.close();
    connection = open(path);
    expect(connection.repository.isCompleted('read', dateKey('2024-02-29'))).toBe(true);
    const saturday: Clock = {
      now: () => new Date('2024-03-02T15:00:00Z'),
      timezone: clock.timezone,
    };
    expect(() => toggleToday(connection.repository, saturday, 'read')).toThrow('not scheduled');
    expect(() =>
      setDayCompletion(connection.repository, saturday, 'read', dateKey('2024-03-02'), true),
    ).toThrow();
    expect(() =>
      setDayCompletion(connection.repository, saturday, 'read', dateKey('2024-03-03'), true),
    ).toThrow();
    expect(() =>
      setDayCompletion(connection.repository, saturday, 'read', dateKey('2024-02-28'), true),
    ).toThrow();
    setDayCompletion(connection.repository, saturday, 'read', dateKey('2024-03-01'), true);
    setDayCompletion(connection.repository, saturday, 'read', dateKey('2024-03-01'), false);
    expect(connection.repository.listCompletions()).toHaveLength(1);
    expect(() =>
      editHabit(connection.repository, 'read', 'Read', 'blue', 'book', clock, []),
    ).toThrow();
  });
  it('restores a file backup atomically, retains current edits and is idempotent after reopen', () => {
    const original = open(':memory:');
    createHabit(original.repository, clock, 'read', 'Read', 'coral', 'book');
    toggleToday(original.repository, clock, 'read');
    const backup = parseBackup(
      serializeBackup(
        original.repository.listHabits(),
        original.repository.listCompletions(),
        clock.now(),
      ),
    );
    const directory = mkdtempSync(join(tmpdir(), 'tiny-wins-backup-'));
    directories.push(directory);
    const path = join(directory, 'restore.db');
    let target = open(path);
    expect(target.repository.mergeBackup(backup)).toEqual({
      habitsAdded: 1,
      winsAdded: 1,
      notesAdded: 0,
    });
    editHabit(target.repository, 'read', 'A newer name', 'blue', 'water');
    expect(target.repository.mergeBackup(backup)).toEqual({
      habitsAdded: 0,
      winsAdded: 0,
      notesAdded: 0,
    });
    target.sqlite.close();
    target = open(path);
    expect(target.repository.getHabit('read')?.title).toBe('A newer name');
    expect(target.repository.listCompletions()).toEqual(backup.completions);
    const conflict = {
      ...backup,
      habits: [
        { ...backup.habits[0]!, id: 'new' },
        { ...backup.habits[0]!, startsOn: dateKey('2024-02-28') },
      ],
      completions: [],
    };
    expect(() => target.repository.mergeBackup(conflict)).toThrow('conflicts');
    expect(target.repository.getHabit('new')).toBeUndefined();
  });
  it('reads multiple SQLite pages without missing or duplicating habits/wins', () => {
    const { repository, sqlite } = open(':memory:');
    const insert = sqlite.prepare(
      'INSERT INTO habits (id,title,color,icon,starts_on,created_at,sort_order,schedule) VALUES (?,?,?,?,?,?,?,?)',
    );
    sqlite.transaction(() => {
      for (let index = 0; index < 205; index++)
        insert.run(
          `habit-${index}`,
          'Read',
          'forest',
          'book',
          '2024-02-29',
          '2024-02-29T12:00:00Z',
          index,
          JSON.stringify([{ from: '2024-02-29', days: [0, 1, 2, 3, 4, 5, 6] }]),
        );
    })();
    for (const habit of repository.listHabits()) toggleToday(repository, clock, habit.id);
    expect(repository.listHabits()).toHaveLength(205);
    expect(new Set(repository.listHabits().map((habit) => habit.id)).size).toBe(205);
    expect(repository.listCompletions()).toHaveLength(205);
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
    sqlite.exec('PRAGMA user_version = 6');
    expect(() => migrate(adapter)).toThrow('newer Tiny Wins');
    expect(sqlite.prepare('PRAGMA user_version').get()).toEqual({ user_version: 6 });
  });
});
