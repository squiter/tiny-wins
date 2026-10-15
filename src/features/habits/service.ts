import {
  habitAppearance,
  habitTitle,
  moveHabitOrder,
  type ColorKey,
  type IconKey,
} from '../../domain/habit';
import { localDay, shiftDay } from '../../domain/calendar';
import {
  changeSchedule,
  allWeekdays,
  nextWeek,
  plannedVersion,
  versionOn,
  validateWeeklyGoal,
  type WeeklyGoal,
  type ScheduleVersion,
  plannedDays,
  plannedTolerance,
  validateTolerance,
  validateWeekdays,
  type Weekday,
} from '../../domain/schedule';
import type { Clock } from '../check-ins/service';
import type { HabitRepository } from './repository';

export function editHabit(
  repository: HabitRepository,
  id: string,
  title: string,
  color: ColorKey,
  icon: IconKey,
  clock?: Clock,
  days?: Weekday[],
  streakTolerance?: number,
  weekly?: WeeklyGoal | null,
) {
  const habit = repository.getHabit(id);
  if (!habit || habit.archivedAt) throw new Error('This habit is not active.');
  habitAppearance(color, icon);
  const planned = plannedVersion(habit.schedule);
  const today = clock ? localDay(clock.now(), clock.timezone()) : undefined;
  const currentWeekly = today ? versionOn(habit.schedule, today)?.weekly : undefined;
  const nextGoal =
    weekly === undefined ? planned.weekly : weekly ? validateWeeklyGoal(weekly) : undefined;
  if (
    (currentWeekly ?? planned.weekly) &&
    nextGoal &&
    (currentWeekly ?? planned.weekly)!.weekStartsOn !== nextGoal.weekStartsOn
  )
    throw new Error('Keep the saved weekly boundary.');
  const nextDays = nextGoal
    ? [...allWeekdays]
    : validateWeekdays(days ?? plannedDays(habit.schedule));
  const nextTolerance = nextGoal
    ? 0
    : validateTolerance(streakTolerance ?? plannedTolerance(habit.schedule));
  const changed =
    JSON.stringify(nextDays) !== JSON.stringify(planned.days) ||
    nextTolerance !== (planned.streakTolerance ?? 0) ||
    JSON.stringify(nextGoal) !== JSON.stringify(planned.weekly);
  let schedule = habit.schedule;
  if (today && changed) {
    const boundary = currentWeekly ?? planned.weekly ?? nextGoal;
    schedule = changeSchedule(
      habit.schedule,
      boundary ? nextWeek(today, boundary.weekStartsOn) : shiftDay(today, 1),
      nextDays,
      nextTolerance,
      nextGoal,
    );
  }
  repository.update(id, { title: habitTitle(title), color, icon, schedule });
}
function pauseVersion(version: ScheduleVersion): ScheduleVersion {
  return { ...version, resumeDays: version.resumeDays ?? version.days, days: [] };
}
function resumeVersion(version: ScheduleVersion, fallback: ScheduleVersion): ScheduleVersion {
  const { resumeDays, ...policy } = version;
  return { ...policy, days: resumeDays ?? (version.days.length ? version.days : fallback.days) };
}
export function archiveHabit(repository: HabitRepository, clock: Clock, id: string) {
  const habit = repository.getHabit(id);
  if (!habit) throw new Error('Habit not found.');
  if (!habit.archivedAt) {
    const now = clock.now();
    const from = shiftDay(localDay(now, clock.timezone()), 1);
    const current = versionOn(habit.schedule, from)!;
    repository.setArchived(id, now.toISOString(), [
      ...habit.schedule.filter((version) => version.from < from),
      pauseVersion({ ...current, from }),
      ...habit.schedule.filter((version) => version.from > from).map(pauseVersion),
    ]);
  }
}
export function restoreHabit(repository: HabitRepository, id: string, clock: Clock) {
  const habit = repository.getHabit(id);
  if (!habit) throw new Error('Habit not found.');
  if (habit.archivedAt) {
    const from = shiftDay(localDay(clock.now(), clock.timezone()), 1);
    const fallback = plannedVersion(habit.schedule);
    repository.setArchived(id, null, [
      ...habit.schedule.filter((version) => version.from < from),
      resumeVersion({ ...versionOn(habit.schedule, from)!, from }, fallback),
      ...habit.schedule
        .filter((version) => version.from > from)
        .map((version) => resumeVersion(version, fallback)),
    ]);
  }
}
export function moveHabit(repository: HabitRepository, id: string, direction: -1 | 1) {
  repository.reorder(moveHabitOrder(repository.listHabits(), id, direction));
}
