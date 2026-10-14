import { localDay } from '../../domain/calendar';
import { completionCelebration, type CheckInOutcome } from '../../domain/feedback';
import { scheduledOn } from '../../domain/schedule';
import type { Clock } from '../check-ins/service';
import type { HabitRepository } from '../habits/repository';
export function checkInCelebration(
  repository: HabitRepository,
  clock: Clock,
  outcome: CheckInOutcome,
) {
  if (!outcome.changed || !outcome.completed) return null;
  try {
    const today = localDay(clock.now(), clock.timezone());
    const due = repository
      .listHabits()
      .filter(
        (habit) =>
          !habit.archivedAt && habit.startsOn <= today && scheduledOn(habit.schedule, today),
      );
    const completed = new Set(
      repository
        .listCompletions()
        .filter((win) => win.localDate === today)
        .map((win) => win.habitId),
    );
    return completionCelebration(
      outcome,
      today,
      due.length,
      due.filter((habit) => completed.has(habit.id)).length,
    );
  } catch {
    return null;
  }
}
