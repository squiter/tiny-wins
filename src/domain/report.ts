import { dateKey, shiftDay, type LocalDate } from './calendar';
import { calendarCells, type Completion, type Habit } from './habit';
import { habitMetrics } from './metrics';
import { calendarOffset, type WeekStartsOn } from './preferences';
export const reportPeriods = ['week', 'month', 'year'] as const;
export type ReportPeriod = (typeof reportPeriods)[number];
export function reportRange(period: ReportPeriod, anchor: LocalDate, weekStartsOn: WeekStartsOn) {
  const year = Number(anchor.slice(0, 4));
  const month = Number(anchor.slice(5, 7));
  if (period === 'week') {
    const start = shiftDay(anchor, -calendarOffset(anchor, weekStartsOn));
    return { start, end: shiftDay(start, 6) };
  }
  if (period === 'month') {
    const start = dateKey(`${anchor.slice(0, 7)}-01`);
    const next = new Date(Date.UTC(year, month, 1, 12)).toISOString().slice(0, 10);
    return { start, end: shiftDay(dateKey(next), -1) };
  }
  return { start: dateKey(`${year}-01-01`), end: dateKey(`${year}-12-31`) };
}
export function shiftReport(period: ReportPeriod, anchor: LocalDate, direction: -1 | 1): LocalDate {
  if (period === 'week') return shiftDay(anchor, direction * 7);
  const date = new Date(`${anchor}T12:00:00Z`);
  date.setUTCDate(1);
  if (period === 'month') date.setUTCMonth(date.getUTCMonth() + direction);
  else {
    date.setUTCMonth(0);
    date.setUTCFullYear(date.getUTCFullYear() + direction);
  }
  return dateKey(date.toISOString().slice(0, 10));
}
export function victoryReport(
  habits: Habit[],
  completions: Completion[],
  today: LocalDate,
  range: { start: LocalDate; end: LocalDate },
) {
  const byHabit = new Map<string, Completion[]>();
  for (const win of completions) {
    const rows = byHabit.get(win.habitId) ?? [];
    rows.push(win);
    byHabit.set(win.habitId, rows);
  }
  const items = habits.map((habit) => {
    const wins = byHabit.get(habit.id) ?? [];
    return {
      habit,
      cells: calendarCells(habit, wins, range.start, range.end, today),
      metrics: habitMetrics(habit, wins, today, range.start, range.end),
    };
  });
  const eligibleDays = items.reduce((sum, item) => sum + item.metrics.eligibleDays, 0);
  const eligibleWins = items.reduce((sum, item) => sum + item.metrics.eligibleWins, 0);
  return {
    items,
    eligibleDays,
    eligibleWins,
    totalWins: items.reduce((sum, item) => sum + item.metrics.totalWins, 0),
    consistency: eligibleDays ? Math.round((100 * eligibleWins) / eligibleDays) : null,
  };
}
