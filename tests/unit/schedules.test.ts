import { describe, expect, it } from 'vitest';
import { dateKey } from '../../src/domain/calendar';
import { currentStreak, history, type Completion, type Habit } from '../../src/domain/habit';
import { habitMetrics, insights, yearCells } from '../../src/domain/metrics';
import { changeSchedule, scheduledOn, validateWeekdays } from '../../src/domain/schedule';
const habit: Habit = {
  id: 'read',
  title: 'Read',
  icon: 'book',
  color: 'coral',
  startsOn: dateKey('2024-02-26'),
  createdAt: '2024-02-26T12:00:00Z',
  archivedAt: null,
  sortOrder: 0,
  schedule: [{ from: dateKey('2024-02-26'), days: [1, 3, 5] }],
};
const win = (day: string): Completion => ({
  habitId: 'read',
  localDate: dateKey(day),
  timezone: 'America/Sao_Paulo',
  completedAt: `${day}T12:00:00Z`,
});
describe('effective weekday schedules', () => {
  it.each([[], [1, 1], [-1], [7], [1.2]].map((days) => ({ days })))(
    'rejects invalid selection $days',
    ({ days }) => expect(() => validateWeekdays(days)).toThrow(),
  );
  it('sorts without mutating input and identifies leap-day weekdays', () => {
    const input = [5, 1, 3];
    expect(validateWeekdays(input)).toEqual([1, 3, 5]);
    expect(input).toEqual([5, 1, 3]);
    expect(scheduledOn(habit.schedule, dateKey('2024-02-28'))).toBe(true);
    expect(scheduledOn(habit.schedule, dateKey('2024-02-29'))).toBe(false);
  });
  it('skips unscheduled dates and permits a pending eligible today', () => {
    const records = [win('2024-02-28'), win('2024-03-01')];
    expect(currentStreak(habit, records, dateKey('2024-03-02'))).toBe(2);
    expect(currentStreak(habit, records, dateKey('2024-03-04'))).toBe(2);
    expect(currentStreak(habit, records, dateKey('2024-03-05'))).toBe(0);
    expect(currentStreak(habit, [...records, win('2024-03-04')], dateKey('2024-03-05'))).toBe(3);
    expect(
      history(habit, records, dateKey('2024-03-04')).find((cell) => cell.day === '2024-03-03')
        ?.state,
    ).toBe('not-scheduled');
  });
  it('preserves past eligibility while replacing only planned versions', () => {
    const schedule = changeSchedule(habit.schedule, dateKey('2024-03-05'), [2, 4]);
    const changed = changeSchedule(schedule, dateKey('2024-03-05'), [6]);
    expect(scheduledOn(changed, dateKey('2024-03-04'))).toBe(true);
    expect(scheduledOn(changed, dateKey('2024-03-06'))).toBe(false);
    expect(scheduledOn(changed, dateKey('2024-03-09'))).toBe(true);
    expect(habit.schedule).toHaveLength(1);
  });
  it('pauses eligible dates without erasing earlier wins or breaking a streak', () => {
    const paused = {
      ...habit,
      schedule: changeSchedule(habit.schedule, dateKey('2024-03-02'), []),
    };
    expect(
      currentStreak(paused, [win('2024-02-28'), win('2024-03-01')], dateKey('2024-03-08')),
    ).toBe(2);
    expect(
      habitMetrics(paused, [win('2024-02-28'), win('2024-03-01')], dateKey('2024-03-08'))
        .eligibleDays,
    ).toBe(3);
  });
});
describe('progress metrics and year grid', () => {
  it('counts eligible dates only, including a pending today in consistency', () => {
    const result = habitMetrics(
      habit,
      [win('2024-02-28'), win('2024-03-01')],
      dateKey('2024-03-04'),
    );
    expect(result).toEqual({
      currentStreak: 2,
      bestStreak: 2,
      totalWins: 2,
      eligibleDays: 4,
      eligibleWins: 2,
      consistency: 50,
    });
  });
  it('keeps recorded off-schedule wins visible but excludes them from eligible consistency', () => {
    const result = habitMetrics(
      habit,
      [win('2024-02-29'), win('2024-03-01'), win('2024-03-06')],
      dateKey('2024-03-04'),
    );
    expect(result.totalWins).toBe(2);
    expect(result.eligibleWins).toBe(1);
    expect(result.consistency).toBe(25);
  });
  it('returns no fabricated percentage before a habit starts', () => {
    expect(habitMetrics(habit, [], dateKey('2024-02-25')).consistency).toBeNull();
    expect(insights([], [], dateKey('2024-03-04'))).toMatchObject({
      consistency: null,
      totalWins: 0,
      activeHabits: 0,
    });
  });
  it('renders complete leap/common years with future and pre-creation states', () => {
    const cells = yearCells(habit, [win('2024-02-28')], 2024, dateKey('2024-03-04'));
    expect(cells).toHaveLength(366);
    expect(yearCells(habit, [], 2023, dateKey('2024-03-04'))).toHaveLength(365);
    expect(cells.find((cell) => cell.day === '2024-02-29')?.state).toBe('not-scheduled');
    expect(cells[0]?.state).toBe('before-start');
    expect(cells.at(-1)?.state).toBe('future');
    expect(() => yearCells(habit, [], 2024.5, dateKey('2024-03-04'))).toThrow();
  });
  it('weights aggregate consistency by eligible opportunities rather than averaging percentages', () => {
    const second = {
      ...habit,
      id: 'new',
      startsOn: dateKey('2024-03-04'),
      schedule: [{ from: dateKey('2024-03-04'), days: [1] as const }].map((s) => ({
        ...s,
        days: [...s.days],
      })),
    };
    const records = [win('2024-02-26'), win('2024-02-28'), win('2024-03-01')];
    const result = insights(
      [habit, second, { ...habit, id: 'archived', archivedAt: '2024-03-01T12:00:00Z' }],
      records,
      dateKey('2024-03-04'),
    );
    expect(result.activeHabits).toBe(2);
    expect(result.eligibleDays).toBe(5);
    expect(result.consistency).toBe(60);
  });
});
