import { dateKey, localDay, type LocalDate } from '../../domain/calendar';
import { noteText } from '../../domain/notes';
import type { Clock } from '../check-ins/service';
import type { HabitRepository } from './repository';
export function saveDayNote(
  repository: HabitRepository,
  clock: Clock,
  habitId: string,
  day: LocalDate,
  text: string,
) {
  const habit = repository.getHabit(habitId);
  const now = clock.now();
  dateKey(day);
  if (!habit || habit.archivedAt || day < habit.startsOn || day > localDay(now, clock.timezone()))
    throw new Error('This date cannot be annotated.');
  repository.setNote({
    habitId,
    localDate: day,
    text: noteText(text),
    updatedAt: now.toISOString(),
  });
}
