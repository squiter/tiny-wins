import { describe, expect, it } from 'vitest';
import { dateKey } from '../../src/domain/calendar';
import type { Habit, Completion } from '../../src/domain/habit';
import { reportRange, shiftReport, victoryReport } from '../../src/domain/report';
const date = dateKey;
const habit: Habit = {
  id: 'read',
  title: 'Read',
  icon: 'book',
  color: 'coral',
  startsOn: date('2024-02-26'),
  createdAt: '2024-02-26T12:00:00Z',
  archivedAt: null,
  sortOrder: 0,
  schedule: [{ from: date('2024-02-26'), days: [1, 3, 5] }],
};
const win = (day: string): Completion => ({
  habitId: 'read',
  localDate: date(day),
  timezone: 'America/Sao_Paulo',
  completedAt: `${day}T12:00:00Z`,
});
describe('Insights period walls', () => {
  it('aligns a week across year boundaries with either first weekday', () => {
    expect(reportRange('week', date('2026-01-01'), 1)).toEqual({
      start: date('2025-12-29'),
      end: date('2026-01-04'),
    });
    expect(reportRange('week', date('2026-01-01'), 0)).toEqual({
      start: date('2025-12-28'),
      end: date('2026-01-03'),
    });
  });
  it('keeps leap-month and yearly date counts exact', () => {
    const today = date('2024-02-29');
    const month = reportRange('month', today, 1);
    expect(month).toEqual({ start: date('2024-02-01'), end: date('2024-02-29') });
    expect(victoryReport([habit], [], today, month).items[0]?.cells).toHaveLength(29);
    expect(
      victoryReport([habit], [], today, reportRange('year', today, 1)).items[0]?.cells,
    ).toHaveLength(366);
    expect(
      victoryReport([habit], [], date('2025-01-01'), reportRange('year', date('2025-01-01'), 1))
        .items[0]?.cells,
    ).toHaveLength(365);
  });
  it('navigates month/year from end dates without overflowing February', () => {
    expect(shiftReport('month', date('2024-01-31'), 1)).toBe('2024-02-01');
    expect(shiftReport('month', date('2024-01-31'), -1)).toBe('2023-12-01');
    expect(shiftReport('year', date('2024-02-29'), 1)).toBe('2025-01-01');
    expect(shiftReport('week', date('2024-02-29'), 1)).toBe('2024-03-07');
  });
  it('shows binary wins and distinct pre-creation/rest/future dates, counting only elapsed opportunities', () => {
    const today = date('2024-02-28');
    const report = victoryReport(
      [habit],
      [win('2024-02-26')],
      today,
      reportRange('week', today, 0),
    );
    expect(report.items[0]?.cells.map((cell) => cell.state)).toEqual([
      'before-start',
      'complete',
      'not-scheduled',
      'missed',
      'future',
      'future',
      'future',
    ]);
    expect(report).toMatchObject({
      eligibleDays: 2,
      eligibleWins: 1,
      totalWins: 1,
      consistency: 50,
    });
  });
  it('retains archived and off-schedule wins without adding rest dates to the denominator', () => {
    const archived = {
      ...habit,
      archivedAt: '2024-02-28T12:00:00Z',
      schedule: [...habit.schedule, { from: date('2024-02-29'), days: [] }],
    };
    const report = victoryReport(
      [archived],
      [win('2024-02-26'), win('2024-02-27')],
      date('2024-03-01'),
      { start: date('2024-02-26'), end: date('2024-03-01') },
    );
    expect(report.items).toHaveLength(1);
    expect(report).toMatchObject({
      totalWins: 2,
      eligibleWins: 1,
      eligibleDays: 2,
      consistency: 50,
    });
    expect(report.items[0]?.cells[1]?.state).toBe('complete');
  });
  it('weights habits by planned opportunities and excludes wins outside the viewed period', () => {
    const second = {
      ...habit,
      id: 'water',
      schedule: [
        { from: habit.startsOn, days: [0, 1, 2, 3, 4, 5, 6] as (0 | 1 | 2 | 3 | 4 | 5 | 6)[] },
      ],
    };
    const report = victoryReport(
      [habit, second],
      [win('2024-02-26'), win('2024-02-28'), { ...win('2024-02-28'), habitId: 'water' }],
      date('2024-02-28'),
      { start: date('2024-02-27'), end: date('2024-02-29') },
    );
    expect(report).toMatchObject({
      eligibleDays: 3,
      eligibleWins: 2,
      totalWins: 2,
      consistency: 67,
    });
  });
  it('has no completion percentage for an empty or pre-creation period', () => {
    const range = { start: date('2024-01-01'), end: date('2024-01-31') };
    expect(victoryReport([habit], [], date('2024-02-28'), range)).toMatchObject({
      eligibleDays: 0,
      totalWins: 0,
      consistency: null,
    });
    expect(victoryReport([], [], date('2024-02-28'), range).items).toEqual([]);
  });
});
