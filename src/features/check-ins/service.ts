import type { CheckInOutcome } from '../../domain/feedback';
import { localDay } from '../../domain/calendar';
import { habitTitle, habitAppearance, type ColorKey, type IconKey } from '../../domain/habit';
import {
  allWeekdays,
  scheduledOn,
  validateTolerance,
  validateWeekdays,
  type Weekday,
} from '../../domain/schedule';
import type { LocalDate } from '../../domain/calendar';
import type { HabitRepository } from '../habits/repository';
export interface Clock {
  now(): Date;
  timezone(): string;
}
export function createHabit(
  repository: HabitRepository,
  clock: Clock,
  id: string,
  title: string,
  color: ColorKey,
  icon: IconKey = 'plant',
  days: Weekday[] = [...allWeekdays],
  streakTolerance = 0,
) {
  const now = clock.now();
  const timezone = clock.timezone();
  habitAppearance(color, icon);
  const sortOrder = Math.max(-1, ...repository.listHabits().map((habit) => habit.sortOrder)) + 1;
  repository.create({
    id,
    title: habitTitle(title),
    color,
    icon,
    archivedAt: null,
    sortOrder,
    startsOn: localDay(now, timezone),
    createdAt: now.toISOString(),
    schedule: [
      {
        from: localDay(now, timezone),
        days: validateWeekdays(days),
        ...(validateTolerance(streakTolerance) > 0 ? { streakTolerance } : {}),
      },
    ],
  });
}
export function toggleToday(
  repository: HabitRepository,
  clock: Clock,
  habitId: string,
): CheckInOutcome {
  const habit = repository.getHabit(habitId);
  if (!habit || habit.archivedAt) throw new Error('This habit is not active.');
  const now = clock.now();
  const timezone = clock.timezone();
  const day = localDay(now, timezone);
  if (
    day < habit.startsOn ||
    (!scheduledOn(habit.schedule, day) && !repository.isCompleted(habitId, day))
  )
    throw new Error('This habit is not scheduled today.');
  const completed = !repository.isCompleted(habitId, day);
  repository.setCompleted(
    { habitId, localDate: day, timezone, completedAt: now.toISOString() },
    completed,
  );
  return { habitId, day, completed, changed: true };
}

export function setDayCompletion(
  repository: HabitRepository,
  clock: Clock,
  habitId: string,
  day: LocalDate,
  completed: boolean,
): CheckInOutcome {
  const habit = repository.getHabit(habitId);
  const now = clock.now();
  const timezone = clock.timezone();
  if (
    !habit ||
    habit.archivedAt ||
    day < habit.startsOn ||
    day > localDay(now, timezone) ||
    (completed && !scheduledOn(habit.schedule, day))
  )
    throw new Error('This date cannot be edited.');
  const changed = repository.isCompleted(habitId, day) !== completed;
  repository.setCompleted(
    { habitId, localDate: day, timezone, completedAt: now.toISOString() },
    completed,
  );
  return { habitId, day, completed, changed };
}
