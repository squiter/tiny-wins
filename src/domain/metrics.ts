import type { DayNote } from './notes';
import { streakProgress } from './streak';
import { dateKey, shiftDay, type LocalDate } from './calendar';
import { calendarCells, currentStreak, type Completion, type Habit } from './habit';
import { scheduledOn } from './schedule';
export function habitMetrics(
  habit: Habit,
  completions: Completion[],
  today: LocalDate,
  start = habit.startsOn,
  end = today,
) {
  const completed = new Set(
    completions.filter((record) => record.habitId === habit.id).map((record) => record.localDate),
  );
  let eligibleDays = 0;
  let eligibleWins = 0;
  const bestStreak = streakProgress(habit, completed, today, start, end).best;
  let totalWins = 0;
  for (let day = start; day <= end && day <= today; day = shiftDay(day, 1)) {
    if (day < habit.startsOn) continue;
    if (completed.has(day)) totalWins += 1;
    if (!scheduledOn(habit.schedule, day)) continue;
    eligibleDays += 1;
    if (completed.has(day)) {
      eligibleWins += 1;
    }
  }
  return {
    currentStreak: currentStreak(habit, completions, today),
    bestStreak,
    totalWins,
    eligibleDays,
    eligibleWins,
    consistency: eligibleDays ? Math.round((100 * eligibleWins) / eligibleDays) : null,
  };
}
export function yearCells(
  habit: Habit,
  completions: Completion[],
  year: number,
  today: LocalDate,
  notes: DayNote[] = [],
) {
  if (!Number.isInteger(year) || year < 1900 || year > 9999)
    throw new Error('Invalid calendar year.');
  return calendarCells(
    habit,
    completions,
    dateKey(`${year}-01-01`),
    dateKey(`${year}-12-31`),
    today,
    notes,
  );
}
export function insights(habits: Habit[], completions: Completion[], today: LocalDate) {
  const active = habits.filter((habit) => !habit.archivedAt);
  const items = active.map((habit) => ({
    habit,
    metrics: habitMetrics(habit, completions, today, shiftDay(today, -29)),
  }));
  const eligible = items.reduce((sum, item) => sum + item.metrics.eligibleDays, 0);
  const wins = items.reduce((sum, item) => sum + item.metrics.eligibleWins, 0);
  return {
    items,
    activeHabits: active.length,
    consistency: eligible ? Math.round((100 * wins) / eligible) : null,
    bestCurrentStreak: Math.max(0, ...items.map((item) => item.metrics.currentStreak)),
    totalWins: habits.reduce(
      (sum, habit) => sum + habitMetrics(habit, completions, today).totalWins,
      0,
    ),
    eligibleDays: eligible,
    eligibleWins: wins,
  };
}
