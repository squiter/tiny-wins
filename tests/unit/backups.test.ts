import { describe, expect, it } from 'vitest';
import { parseBackup, serializeBackup } from '../../src/domain/backup';
import { dateKey } from '../../src/domain/calendar';
import type { Completion, Habit } from '../../src/domain/habit';
const habit: Habit = {
  id: 'habit-a',
  title: 'Read',
  color: 'coral',
  icon: 'book',
  createdAt: '2024-02-29T12:00:00Z',
  startsOn: dateKey('2024-02-29'),
  archivedAt: null,
  sortOrder: 0,
  schedule: [
    { from: dateKey('2024-02-29'), days: [0, 1, 2, 3, 4, 5, 6] },
    { from: dateKey('2024-03-02'), days: [] },
  ],
};
const win: Completion = {
  habitId: habit.id,
  localDate: dateKey('2024-02-29'),
  completedAt: '2024-03-01T01:00:00Z',
  timezone: 'America/Sao_Paulo',
};
const now = new Date('2024-03-02T12:00:00Z');
const source = () => JSON.parse(serializeBackup([habit], [win], now));
describe('versioned local backup format', () => {
  it('roundtrips calendar dates, timezone context, icons and pause schedules', () => {
    const encoded = serializeBackup([habit], [win], now);
    const parsed = parseBackup(encoded);
    expect(parsed.habits).toEqual([habit]);
    expect(parsed.completions).toEqual([win]);
    expect(parsed.exportedAt).toBe(now.toISOString());
    expect(parseBackup('\uFEFF' + encoded)).toEqual(parsed);
    expect(serializeBackup([], [], now)).toContain('"version": 2');
  });
  it.each(['not json', '[]', '{}', '{"format":"tiny-wins","version":2}'])(
    'rejects incompatible source %s',
    (text) => expect(() => parseBackup(text)).toThrow(),
  );
  it.each(['color', 'icon', 'createdAt', 'startsOn', 'sortOrder', 'schedule'])(
    'rejects missing habit field %s',
    (field) => {
      const data = source();
      delete data.habits[0][field];
      expect(() => parseBackup(JSON.stringify(data))).toThrow();
    },
  );
  it('rejects duplicates, dangling/pre-creation wins and invalid timezones', () => {
    for (const transform of [
      (data: ReturnType<typeof source>) => data.habits.push(data.habits[0]),
      (data: ReturnType<typeof source>) => data.completions.push(data.completions[0]),
      (data: ReturnType<typeof source>) => {
        data.completions[0].habitId = 'missing';
      },
      (data: ReturnType<typeof source>) => {
        data.completions[0].localDate = '2024-02-28';
      },
      (data: ReturnType<typeof source>) => {
        data.completions[0].timezone = 'Not/A_Zone';
      },
    ]) {
      const data = source();
      transform(data);
      expect(() => parseBackup(JSON.stringify(data))).toThrow();
    }
  });
  it('rejects unordered schedules and invalid days, limits oversized files', () => {
    const data = source();
    data.habits[0].schedule.reverse();
    expect(() => parseBackup(JSON.stringify(data))).toThrow();
    const second = source();
    second.habits[0].schedule[0].days = [1, 1];
    expect(() => parseBackup(JSON.stringify(second))).toThrow();
    expect(() => parseBackup(' '.repeat(5 * 1024 * 1024 + 1))).toThrow('5 MB');
  });
});
