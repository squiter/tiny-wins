import { describe, expect, it } from 'vitest';
import { dateKey } from '../../src/domain/calendar';
import { calendarCells, currentStreak, type Habit, type Completion } from '../../src/domain/habit';
import { habitMetrics } from '../../src/domain/metrics';
import { allWeekdays, changeSchedule, validateTolerance } from '../../src/domain/schedule';
import { parseBackup, serializeBackup } from '../../src/domain/backup';
const day = dateKey;
const habit: Habit = {
  id: 'read',
  title: 'Read',
  icon: 'book',
  color: 'coral',
  archivedAt: null,
  sortOrder: 0,
  startsOn: day('2026-10-11'),
  createdAt: '2026-10-11T12:00:00Z',
  schedule: [{ from: day('2026-10-11'), days: [...allWeekdays], streakTolerance: 1 }],
};
const wins = (...days: string[]): Completion[] =>
  days.map((value) => ({
    habitId: 'read',
    localDate: day(value),
    timezone: 'America/Sao_Paulo',
    completedAt: `${value}T12:00:00Z`,
  }));
const states = (h: Habit, records: Completion[], today: string) =>
  calendarCells(h, records, h.startsOn, day(today), day(today)).map((c) => c.state);
describe('renewable streak flexibility', () => {
  it('bridges Monday, renews after Tuesday, and counts only real wins', () => {
    const records = wins('2026-10-11', '2026-10-13', '2026-10-15');
    expect(currentStreak(habit, records, day('2026-10-15'))).toBe(3);
    expect(states(habit, records, '2026-10-15')).toEqual([
      'complete',
      'grace',
      'complete',
      'grace',
      'complete',
    ]);
    expect(habitMetrics(habit, records, day('2026-10-15'))).toMatchObject({
      currentStreak: 3,
      bestStreak: 3,
      totalWins: 3,
      eligibleDays: 5,
      consistency: 60,
    });
  });
  it('preserves pending today, breaks after a second past miss, retains previously granted grace', () => {
    const records = wins('2026-10-11');
    expect(currentStreak(habit, records, day('2026-10-13'))).toBe(1);
    expect(currentStreak(habit, records, day('2026-10-14'))).toBe(0);
    expect(states(habit, records, '2026-10-14')).toEqual(['complete', 'grace', 'missed', 'missed']);
    expect(states(habit, [], '2026-10-14')).not.toContain('grace');
  });
  it('skips rest/paused dates and never grants future/pre-start grace', () => {
    const weekly: Habit = {
      ...habit,
      schedule: [{ from: habit.startsOn, days: [0, 2, 4], streakTolerance: 1 }],
    };
    const records = wins('2026-10-11', '2026-10-15');
    expect(currentStreak(weekly, records, day('2026-10-15'))).toBe(2);
    expect(states(weekly, records, '2026-10-15')).toEqual([
      'complete',
      'not-scheduled',
      'grace',
      'not-scheduled',
      'complete',
    ]);
    const cells = calendarCells(
      weekly,
      records,
      day('2026-10-10'),
      day('2026-10-16'),
      day('2026-10-15'),
    );
    expect(cells[0]?.state).toBe('before-start');
    expect(cells.at(-1)?.state).toBe('future');
    const paused = {
      ...habit,
      schedule: [
        ...habit.schedule,
        { from: day('2026-10-12'), days: [] },
        { from: day('2026-10-15'), days: [...allWeekdays], streakTolerance: 1 },
      ],
    };
    expect(currentStreak(paused, records, day('2026-10-15'))).toBe(2);
  });
  it('preserves zero-default history and respects effective-date rules', () => {
    const strict = { ...habit, schedule: [{ from: habit.startsOn, days: [...allWeekdays] }] };
    const records = wins('2026-10-11', '2026-10-13');
    expect(currentStreak(strict, records, day('2026-10-13'))).toBe(1);
    const changed = {
      ...strict,
      schedule: changeSchedule(strict.schedule, day('2026-10-13'), [...allWeekdays], 1),
    };
    expect(states(changed, records, '2026-10-13')[1]).toBe('missed');
    expect(currentStreak(changed, records, day('2026-10-13'))).toBe(1);
    expect(
      currentStreak(
        habit,
        records.filter((c) => c.localDate !== '2026-10-13'),
        day('2026-10-15'),
      ),
    ).toBe(0);
    expect(habitMetrics(habit, records, day('2026-10-15'), day('2026-10-13')).bestStreak).toBe(1);
  });
  it('roundtrips v2 policy, accepts v1 zero-default, rejects invalid policy', () => {
    const source = serializeBackup([habit], wins('2026-10-11'), new Date('2026-10-15T12:00:00Z'));
    expect(parseBackup(source).habits[0]?.schedule[0]?.streakTolerance).toBe(1);
    const old = JSON.parse(source);
    old.version = 1;
    delete old.habits[0].schedule[0].streakTolerance;
    expect(parseBackup(JSON.stringify(old)).habits[0]?.schedule[0]?.streakTolerance ?? 0).toBe(0);
    for (const invalid of [-1, 8, 1.5, null, '1']) {
      expect(() => validateTolerance(invalid)).toThrow();
      const bad = JSON.parse(source);
      bad.habits[0].schedule[0].streakTolerance = invalid;
      expect(() => parseBackup(JSON.stringify(bad))).toThrow();
    }
  });
});
