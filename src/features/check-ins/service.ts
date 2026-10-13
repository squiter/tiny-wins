import { localDay } from '../../domain/calendar';
import { habitTitle, habitAppearance, type ColorKey, type IconKey } from '../../domain/habit';
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
) {
  const now = clock.now();
  habitAppearance(color, icon);
  const sortOrder = Math.max(-1, ...repository.listHabits().map((habit) => habit.sortOrder)) + 1;
  repository.create({
    id,
    title: habitTitle(title),
    color,
    icon,
    archivedAt: null,
    sortOrder,
    startsOn: localDay(now, clock.timezone()),
    createdAt: now.toISOString(),
  });
}
export function toggleToday(repository: HabitRepository, clock: Clock, habitId: string) {
  const habit = repository.getHabit(habitId);
  if (!habit || habit.archivedAt) throw new Error('This habit is not active.');
  const now = clock.now();
  const timezone = clock.timezone();
  const day = localDay(now, timezone);
  repository.setCompleted(
    { habitId, localDate: day, timezone, completedAt: now.toISOString() },
    !repository.isCompleted(habitId, day),
  );
}
