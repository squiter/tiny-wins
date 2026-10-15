import { describe, expect, it } from 'vitest';
import { dateKey, localDay } from '../../src/domain/calendar';
import { currentStreak, history, type Completion, type Habit } from '../../src/domain/habit';
import { habitMetrics, insights } from '../../src/domain/metrics';
import { parseBackup, serializeBackup } from '../../src/domain/backup';
import {
  allWeekdays,
  nextWeek,
  plannedVersion,
  validateSchedulePolicies,
  validateWeeklyGoal,
} from '../../src/domain/schedule';
import { weeklyPeriods } from '../../src/domain/weekly';
const day = dateKey;
function weekly(starts = '2024-12-23', target = 3, weekStartsOn: 0 | 1 = 1): Habit {
  return {
    id: 'walk',
    title: 'Walk',
    icon: 'walk',
    color: 'teal',
    startsOn: day(starts),
    createdAt: `${starts}T12:00:00Z`,
    archivedAt: null,
    sortOrder: 0,
    schedule: [{ from: day(starts), days: [...allWeekdays], weekly: { target, weekStartsOn } }],
  };
}
function wins(...dates: string[]): Completion[] {
  return dates.map((date) => ({
    habitId: 'walk',
    localDate: day(date),
    completedAt: `${date}T12:00:00Z`,
    timezone: 'America/Sao_Paulo',
  }));
}
const twoWeeks = wins(
  '2024-12-23',
  '2024-12-25',
  '2024-12-27',
  '2024-12-30',
  '2025-01-01',
  '2025-01-03',
);
describe('fixed flexible weekly goals', () => {
  it.each([0, 8, 1.5, NaN, '3', null])('rejects invalid target %s', (target) => {
    expect(() => validateWeeklyGoal({ target, weekStartsOn: 1 })).toThrow();
  });
  it('retains the daily fallback for a legacy archived history without resume metadata', () => {
    const h = weekly();
    h.schedule = [{ from: h.startsOn, days: [] }];
    expect(plannedVersion(h.schedule).days).toEqual([...allWeekdays]);
    expect(() =>
      parseBackup(
        JSON.stringify({
          format: 'tiny-wins',
          version: 3,
          exportedAt: h.createdAt,
          habits: [h],
          completions: [],
          notes: [],
        }),
      ),
    ).not.toThrow();
  });
  it('supports both boundaries without treating a local date as a UTC completion timestamp', () => {
    expect(nextWeek(day('2024-12-29'), 1)).toBe('2024-12-30');
    expect(nextWeek(day('2024-12-29'), 0)).toBe('2025-01-05');
    const today = localDay(new Date('2024-12-30T01:00:00Z'), 'America/Sao_Paulo');
    expect(today).toBe('2024-12-29');
    const h = weekly('2024-12-29', 3, 0);
    expect(habitMetrics(h, wins(today), today).weekly).toMatchObject({
      start: '2024-12-29',
      end: '2025-01-04',
      target: 3,
      wins: 1,
    });
  });
  it('caps the first Saturday week to two available dates and never invents wins', () => {
    const h = weekly('2024-12-28');
    expect(habitMetrics(h, [], day('2024-12-28')).weekly).toMatchObject({
      activeDays: 2,
      goal: 3,
      target: 2,
      wins: 0,
      achieved: false,
    });
    expect(currentStreak(h, wins('2024-12-28', '2024-12-29'), day('2024-12-29'))).toBe(1);
    const cells = history(h, [], day('2024-12-29'));
    expect(cells).toHaveLength(14);
    expect(cells.slice(-2).map((cell) => cell.state)).toEqual(['flexible', 'flexible']);
  });
  it('extends on reaching an open week, keeps an unfinished week pending and excludes it from consistency', () => {
    const h = weekly();
    expect(currentStreak(h, twoWeeks.slice(0, 3), day('2025-01-04'))).toBe(1);
    const reached = habitMetrics(h, twoWeeks, day('2025-01-04'));
    expect(reached).toMatchObject({
      currentStreak: 2,
      bestStreak: 2,
      eligibleDays: 1,
      eligibleWins: 1,
      consistency: 100,
      streakUnit: 'weeks',
    });
    expect(reached.weekly).toMatchObject({
      start: '2024-12-30',
      end: '2025-01-05',
      wins: 3,
      target: 3,
      achieved: true,
      closed: false,
    });
    const undone = twoWeeks.filter((win) => win.localDate !== '2025-01-03');
    expect(currentStreak(h, undone, day('2025-01-04'))).toBe(1);
    expect(currentStreak(h, undone, day('2025-01-06'))).toBe(0);
    expect(
      history(h, undone, day('2025-01-06')).filter((cell) => cell.state === 'complete'),
    ).toHaveLength(4);
  });
  it('never compares weekly streak lengths with daily win streaks in aggregate metrics', () => {
    const h = weekly('2024-12-09', 1);
    const daily: Habit = {
      ...h,
      id: 'daily',
      schedule: [{ from: h.startsOn, days: [...allWeekdays] }],
    };
    const dates = [
      ...wins('2024-12-09', '2024-12-16', '2024-12-23'),
      ...wins('2024-12-29', '2024-12-30').map((win) => ({ ...win, habitId: 'daily' })),
    ];
    expect(insights([h, daily], dates, day('2024-12-30'))).toMatchObject({
      bestCurrentStreak: 2,
      bestCurrentWeeklyStreak: 3,
    });
  });
  it('counts a closed cross-year goal once on its ending date and keeps tile/total wins on actual dates', () => {
    const h = weekly();
    const december = habitMetrics(
      h,
      twoWeeks,
      day('2025-01-06'),
      day('2024-12-30'),
      day('2024-12-31'),
    );
    expect(december).toMatchObject({
      eligibleDays: 0,
      eligibleWins: 0,
      consistency: null,
      totalWins: 1,
    });
    const january = habitMetrics(
      h,
      twoWeeks,
      day('2025-01-06'),
      day('2025-01-01'),
      day('2025-01-06'),
    );
    expect(january).toMatchObject({
      eligibleDays: 1,
      eligibleWins: 1,
      consistency: 100,
      totalWins: 2,
      bestStreak: 1,
    });
  });
  it('keeps extra real wins but never awards multiple achievements or counts duplicate dates', () => {
    const h = weekly('2024-12-23', 1);
    const dates = wins('2024-12-23', '2024-12-24', '2024-12-25', '2024-12-25');
    const result = habitMetrics(h, dates, day('2024-12-30'));
    expect(result).toMatchObject({
      totalWins: 3,
      currentStreak: 1,
      eligibleDays: 1,
      eligibleWins: 1,
      consistency: 100,
    });
  });
  it('skips fully paused weeks, caps partial weeks and preserves weekly continuity on target changes', () => {
    const h = weekly();
    const policy = h.schedule[0]!.weekly!;
    h.schedule.push(
      { from: day('2024-12-26'), days: [], resumeDays: [...allWeekdays], weekly: policy },
      { from: day('2025-01-02'), days: [...allWeekdays], weekly: policy },
      { from: day('2025-01-06'), days: [], resumeDays: [...allWeekdays], weekly: policy },
      { from: day('2025-01-13'), days: [...allWeekdays], weekly: { ...policy, target: 2 } },
    );
    const dates = wins(
      '2024-12-23',
      '2024-12-24',
      '2024-12-25',
      '2025-01-02',
      '2025-01-03',
      '2025-01-04',
      '2025-01-13',
      '2025-01-14',
    );
    const periods = weeklyPeriods(h, new Set(dates.map((win) => win.localDate)), day('2025-01-14'));
    expect(periods.map((week) => week.activeDays)).toEqual([3, 4, 7]);
    expect(currentStreak(h, dates, day('2025-01-14'))).toBe(3);
    expect(() => validateSchedulePolicies(h.schedule)).not.toThrow();
  });
  it('preserves historical daily grace but switches streak units without bridging daily/weekly eras', () => {
    const h = weekly('2024-12-23');
    h.schedule[0] = { from: h.startsOn, days: [...allWeekdays], streakTolerance: 1 };
    h.schedule.push({
      from: day('2024-12-30'),
      days: [...allWeekdays],
      weekly: { target: 1, weekStartsOn: 1 },
    });
    const dates = wins('2024-12-23', '2024-12-25', '2024-12-30');
    expect(currentStreak(h, dates, day('2024-12-30'))).toBe(1);
    expect(
      history(h, dates, day('2024-12-30')).find((cell) => cell.day === '2024-12-24')?.state,
    ).toBe('grace');
    h.schedule.push({ from: day('2025-01-06'), days: [...allWeekdays] });
    expect(currentStreak(h, [...dates, ...wins('2025-01-06')], day('2025-01-06'))).toBe(1);
    expect(habitMetrics(h, dates, day('2025-01-06')).streakUnit).toBe('wins');
  });
  it('rejects malformed or midweek policies and retains v4 weekly and pause metadata', () => {
    const h = weekly();
    const encoded = serializeBackup([h], twoWeeks, new Date('2025-01-06T12:00:00Z'));
    expect(parseBackup(encoded).habits).toEqual([h]);
    expect(JSON.parse(encoded).version).toBe(4);
    for (const version of [1, 2, 3])
      expect(() => parseBackup(JSON.stringify({ ...JSON.parse(encoded), version }))).toThrow();
    h.schedule.push({
      from: day('2024-12-25'),
      days: [...allWeekdays],
      weekly: { target: 2, weekStartsOn: 1 },
    });
    expect(() => serializeBackup([h], [], new Date())).toThrow('week boundary');
    h.schedule.pop();
    h.schedule[0]!.days = [1, 3, 5];
    expect(() => serializeBackup([h], [], new Date())).toThrow('weekly policy');
  });
});
