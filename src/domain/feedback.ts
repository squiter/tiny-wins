import type { LocalDate } from './calendar';
export interface CheckInOutcome {
  habitId: string;
  day: LocalDate;
  completed: boolean;
  changed: boolean;
}
export type CelebrationKind = 'win' | 'all-day';
export function completionCelebration(
  outcome: CheckInOutcome,
  today: LocalDate,
  planned: number,
  wins: number,
): CelebrationKind | null {
  if (!outcome.changed || !outcome.completed) return null;
  return outcome.day === today && planned > 0 && wins === planned ? 'all-day' : 'win';
}

export function celebrationMotionAllowed(enabled: boolean, reducedMotion: boolean): boolean {
  return enabled && !reducedMotion;
}
