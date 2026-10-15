import { shiftDay, type LocalDate } from './calendar';
import type { Habit } from './habit';
import { weeklyPeriods, weeklyStreak } from './weekly';
import { versionOn, scheduledOn, toleranceOn } from './schedule';

export function streakProgress(
  habit: Habit,
  completed: Set<LocalDate>,
  today: LocalDate,
  start = habit.startsOn,
  end = today,
) {
  let current = 0;
  let best = 0;
  let missed = 0;
  const grace = new Set<LocalDate>();
  if (completed.size === 0) return { current, best, grace };
  for (let day = start; day <= end && day <= today; day = shiftDay(day, 1)) {
    if (versionOn(habit.schedule, day)?.weekly) {
      current = 0;
      missed = 0;
      continue;
    }
    if (day < habit.startsOn || !scheduledOn(habit.schedule, day)) continue;
    if (completed.has(day)) {
      current += 1;
      best = Math.max(best, current);
      missed = 0;
    } else if (day !== today) {
      missed += 1;
      if (current > 0 && missed <= toleranceOn(habit.schedule, day)) grace.add(day);
      else current = 0;
    }
  }
  if (versionOn(habit.schedule, today)?.weekly) {
    const weeks = weeklyStreak(weeklyPeriods(habit, completed, today), today, start, end);
    return { ...weeks, grace };
  }
  return { current, best, grace };
}
