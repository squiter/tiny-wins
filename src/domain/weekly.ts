import { shiftDay, type LocalDate } from './calendar';
import type { Habit } from './habit';
import { weekStart } from './schedule';

export interface WeeklyPeriod {
  start: LocalDate;
  end: LocalDate;
  era: number;
  goal: number;
  target: number;
  wins: number;
  activeDays: number;
  achieved: boolean;
  closed: boolean;
}
// Group actual eligible dates by the policy's saved boundary, including known
// remaining dates of the open week. Paused versions contribute no opportunities.
export function weeklyPeriods(
  habit: Habit,
  completed: ReadonlySet<LocalDate>,
  today: LocalDate,
  from = habit.startsOn,
  to = today,
): WeeklyPeriod[] {
  const groups = new Map<string, WeeklyPeriod>();
  let era = 0;
  for (let index = 0; index < habit.schedule.length; index += 1) {
    const version = habit.schedule[index]!;
    const previous = habit.schedule[index - 1];
    if (!version.weekly) continue;
    if (!previous?.weekly || previous.weekly.weekStartsOn !== version.weekly.weekStartsOn) era += 1;
    if (!version.days.length) continue;
    const low = [version.from, habit.startsOn, shiftDay(from, -6)].sort().at(-1)!;
    const high = [
      habit.schedule[index + 1]
        ? shiftDay(habit.schedule[index + 1]!.from, -1)
        : shiftDay(to < today ? to : today, 6),
      shiftDay(to < today ? to : today, 6),
    ].sort()[0]!;
    for (let day = low; day <= high; day = shiftDay(day, 1)) {
      const start = weekStart(day, version.weekly.weekStartsOn);
      if (start > today) continue;
      const key = `${era}:${start}`;
      let period = groups.get(key);
      if (!period) {
        period = {
          start,
          end: shiftDay(start, 6),
          era,
          goal: version.weekly.target,
          target: 0,
          wins: 0,
          activeDays: 0,
          achieved: false,
          closed: shiftDay(start, 6) < today,
        };
        groups.set(key, period);
      }
      period.activeDays += 1;
      if (day <= today && completed.has(day)) period.wins += 1;
    }
  }
  return [...groups.values()]
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((period) => ({
      ...period,
      target: Math.min(period.goal, period.activeDays),
      achieved: period.wins >= Math.min(period.goal, period.activeDays),
    }));
}
export function weeklyStreak(
  periods: WeeklyPeriod[],
  today: LocalDate,
  start: LocalDate,
  end: LocalDate,
) {
  let current = 0;
  let best = 0;
  let inRange = 0;
  let era = -1;
  for (const period of periods) {
    if (period.era !== era) {
      current = 0;
      inRange = 0;
      era = period.era;
    }
    const anchor = period.closed ? period.end : today;
    if (anchor < start || anchor > end) inRange = 0;
    if (period.achieved) {
      current += 1;
      if (anchor >= start && anchor <= end) {
        inRange += 1;
        best = Math.max(best, inRange);
      }
    } else if (period.closed) {
      current = 0;
      inRange = 0;
    }
  }
  return { current, best };
}
