import {
  habitAppearance,
  habitTitle,
  moveHabitOrder,
  type ColorKey,
  type IconKey,
} from '../../domain/habit';
import { localDay, shiftDay } from '../../domain/calendar';
import { changeSchedule, plannedDays, validateWeekdays, type Weekday } from '../../domain/schedule';
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
) {
  const habit = repository.getHabit(id);
  if (!habit || habit.archivedAt) throw new Error('This habit is not active.');
  habitAppearance(color, icon);
  const schedule =
    clock && days
      ? changeSchedule(
          habit.schedule,
          shiftDay(localDay(clock.now(), clock.timezone()), 1),
          validateWeekdays(days),
        )
      : habit.schedule;
  repository.update(id, { title: habitTitle(title), color, icon, schedule });
}
export function archiveHabit(repository: HabitRepository, clock: Clock, id: string) {
  const habit = repository.getHabit(id);
  if (!habit) throw new Error('Habit not found.');
  if (!habit.archivedAt) {
    const now = clock.now();
    repository.setArchived(
      id,
      now.toISOString(),
      changeSchedule(habit.schedule, shiftDay(localDay(now, clock.timezone()), 1), []),
    );
  }
}
export function restoreHabit(repository: HabitRepository, id: string, clock: Clock) {
  const habit = repository.getHabit(id);
  if (!habit) throw new Error('Habit not found.');
  if (habit.archivedAt)
    repository.setArchived(
      id,
      null,
      changeSchedule(
        habit.schedule,
        shiftDay(localDay(clock.now(), clock.timezone()), 1),
        plannedDays(habit.schedule),
      ),
    );
}
export function moveHabit(repository: HabitRepository, id: string, direction: -1 | 1) {
  repository.reorder(moveHabitOrder(repository.listHabits(), id, direction));
}
