import {
  habitAppearance,
  habitTitle,
  moveHabitOrder,
  type ColorKey,
  type IconKey,
} from '../../domain/habit';
import type { Clock } from '../check-ins/service';
import type { HabitRepository } from './repository';

export function editHabit(
  repository: HabitRepository,
  id: string,
  title: string,
  color: ColorKey,
  icon: IconKey,
) {
  if (!repository.getHabit(id)) throw new Error('Habit not found.');
  habitAppearance(color, icon);
  repository.update(id, { title: habitTitle(title), color, icon });
}
export function archiveHabit(repository: HabitRepository, clock: Clock, id: string) {
  const habit = repository.getHabit(id);
  if (!habit) throw new Error('Habit not found.');
  if (!habit.archivedAt) repository.setArchived(id, clock.now().toISOString());
}
export function restoreHabit(repository: HabitRepository, id: string) {
  const habit = repository.getHabit(id);
  if (!habit) throw new Error('Habit not found.');
  if (habit.archivedAt) repository.setArchived(id, null);
}
export function moveHabit(repository: HabitRepository, id: string, direction: -1 | 1) {
  repository.reorder(moveHabitOrder(repository.listHabits(), id, direction));
}
