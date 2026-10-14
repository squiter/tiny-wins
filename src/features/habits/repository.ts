import type { Backup } from '../../domain/backup';
import type { Completion, Habit, ColorKey, IconKey } from '../../domain/habit';
import type { ScheduleVersion } from '../../domain/schedule';
import type { LocalDate } from '../../domain/calendar';
import type { DayNote } from '../../domain/notes';
export interface HabitRepository {
  listNotes(): DayNote[];
  setNote(note: DayNote): void;
  listHabits(): Habit[];
  listCompletions(): Completion[];
  getHabit(id: string): Habit | undefined;
  create(habit: Habit): void;
  update(
    id: string,
    changes: { title: string; color: ColorKey; icon: IconKey; schedule: ScheduleVersion[] },
  ): void;
  setArchived(id: string, timestamp: string | null, schedule: ScheduleVersion[]): void;
  reorder(ids: string[]): void;
  mergeBackup(backup: Backup): { habitsAdded: number; winsAdded: number; notesAdded: number };
  setCompleted(completion: Completion, completed: boolean): void;
  isCompleted(habitId: string, day: LocalDate): boolean;
}
