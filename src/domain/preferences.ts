import type { LocalDate } from './calendar';
export type WeekStartsOn = 0 | 1;
export function validateWeekStart(value: unknown): WeekStartsOn {
  if (value !== 0 && value !== 1) throw new Error('Choose Sunday or Monday to start the week.');
  return value;
}
export function calendarOffset(day: LocalDate, startsOn: WeekStartsOn): number {
  return (new Date(`${day}T12:00:00Z`).getUTCDay() - validateWeekStart(startsOn) + 7) % 7;
}
export function calendarWeekdays(startsOn: WeekStartsOn): string[] {
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const start = validateWeekStart(startsOn);
  return [...labels.slice(start), ...labels.slice(0, start)];
}
