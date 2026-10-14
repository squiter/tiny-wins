import { describe, expect, it } from 'vitest';
import { dateKey, localDay, shiftDay } from '../../src/domain/calendar';
import {
  currentStreak,
  habitTitle,
  history,
  type Habit,
  type Completion,
} from '../../src/domain/habit';
const habit: Habit = {
  id: 'habit-1',
  title: 'Read',
  color: 'forest',
  icon: 'plant',
  archivedAt: null,
  sortOrder: 0,
  schedule: [{ from: dateKey('2024-02-01'), days: [0, 1, 2, 3, 4, 5, 6] }],
  startsOn: dateKey('2024-02-01'),
  createdAt: '2024-02-01T12:00:00Z',
};
const completion = (day: string): Completion => ({
  habitId: habit.id,
  localDate: dateKey(day),
  timezone: 'America/Sao_Paulo',
  completedAt: '2024-02-29T12:00:00Z',
});
describe('local calendar', () => {
  it.each(['2024-02-30', '2023-02-29', '2024-13-01', 'garbage'])('rejects invalid date %s', (day) =>
    expect(() => dateKey(day)).toThrow(),
  );
  it('crosses leap days and year boundaries', () => {
    expect(shiftDay(dateKey('2024-03-01'), -1)).toBe('2024-02-29');
    expect(shiftDay(dateKey('2025-01-01'), -1)).toBe('2024-12-31');
  });
  it.each([
    ['2024-03-01T01:00:00Z', 'America/Sao_Paulo', '2024-02-29'],
    ['2024-03-01T01:00:00Z', 'Asia/Tokyo', '2024-03-01'],
    ['2024-03-10T06:59:00Z', 'America/New_York', '2024-03-10'],
    ['2024-03-10T07:01:00Z', 'America/New_York', '2024-03-10'],
    ['2024-11-03T05:30:00Z', 'America/New_York', '2024-11-03'],
    ['2024-11-03T06:30:00Z', 'America/New_York', '2024-11-03'],
  ])('maps %s in %s to the local day', (instant, zone, expected) =>
    expect(localDay(new Date(instant), zone)).toBe(expected),
  );
});
describe('daily habits', () => {
  it('validates names', () => {
    expect(habitTitle('  Read  ')).toBe('Read');
    expect(() => habitTitle('  ')).toThrow();
    expect(() => habitTitle('a'.repeat(81))).toThrow();
  });
  it('builds exactly 14 ordered dates and marks today', () => {
    const cells = history(habit, [completion('2024-02-29')], dateKey('2024-03-01'));
    expect(cells).toHaveLength(14);
    expect(cells[0]?.day).toBe('2024-02-17');
    expect(cells.filter((cell) => cell.today)).toHaveLength(1);
    expect(cells[12]?.state).toBe('complete');
  });
  it('preserves earlier wins after a gap and excludes other habits', () => {
    const completions = [
      completion('2024-02-27'),
      { ...completion('2024-02-29'), habitId: 'other' },
    ];
    expect(currentStreak(habit, completions, dateKey('2024-03-01'))).toBe(0);
    expect(
      history(habit, completions, dateKey('2024-03-01')).find((cell) => cell.day === '2024-02-27')
        ?.state,
    ).toBe('complete');
  });
  it('allows today to be pending and counts it once completed', () => {
    const records = [completion('2024-02-28'), completion('2024-02-29')];
    expect(currentStreak(habit, records, dateKey('2024-03-01'))).toBe(2);
    expect(
      currentStreak(habit, [...records, completion('2024-03-01')], dateKey('2024-03-01')),
    ).toBe(3);
  });
  it('does not count pre-creation or future dates toward the streak', () => {
    const newHabit = { ...habit, startsOn: dateKey('2024-03-01') };
    expect(
      currentStreak(
        newHabit,
        [completion('2024-02-29'), completion('2024-03-02')],
        dateKey('2024-03-01'),
      ),
    ).toBe(0);
    expect(history(newHabit, [], dateKey('2024-03-01'))[12]?.state).toBe('before-start');
  });
});
