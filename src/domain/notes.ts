import type { LocalDate } from './calendar';
export const noteLimit = 280;
export interface DayNote {
  habitId: string;
  localDate: LocalDate;
  text: string;
  updatedAt: string;
}
export function noteText(value: string): string {
  if (typeof value !== 'string' || value.length > noteLimit)
    throw new Error('Use a note of up to 280 characters.');
  return value.trim();
}
