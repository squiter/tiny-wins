import type { Completion, Habit, ColorKey, IconKey } from '../../domain/habit';
import type { LocalDate } from '../../domain/calendar';
export interface HabitRepository {
  listHabits(): Habit[];
  listCompletions(): Completion[];
  getHabit(id: string): Habit | undefined;
  create(habit: Habit): void;
  update(id: string, changes: { title: string; color: ColorKey; icon: IconKey }): void;
  setArchived(id: string, timestamp: string | null): void;
  reorder(ids: string[]): void;
  setCompleted(completion: Completion, completed: boolean): void;
  isCompleted(habitId: string, day: LocalDate): boolean;
}
