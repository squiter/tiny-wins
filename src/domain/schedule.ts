import { type LocalDate } from './calendar';
export const allWeekdays = [0, 1, 2, 3, 4, 5, 6] as const;
export type Weekday = (typeof allWeekdays)[number];
export interface ScheduleVersion {
  from: LocalDate;
  days: Weekday[];
}
export function validateWeekdays(days: readonly number[]): Weekday[] {
  if (
    !days.length ||
    days.length > 7 ||
    days.some((day) => !Number.isInteger(day) || day < 0 || day > 6) ||
    new Set(days).size !== days.length
  )
    throw new Error('Choose at least one valid weekday.');
  return [...days].sort((a, b) => a - b) as Weekday[];
}
export function scheduledOn(schedule: ScheduleVersion[], day: LocalDate): boolean {
  const version = schedule.findLast((item) => item.from <= day);
  return !!version?.days.includes(new Date(`${day}T12:00:00Z`).getUTCDay() as Weekday);
}
export function changeSchedule(
  schedule: ScheduleVersion[],
  from: LocalDate,
  days: Weekday[],
): ScheduleVersion[] {
  return [...schedule.filter((version) => version.from < from), { from, days: [...days] }];
}
export function plannedDays(schedule: ScheduleVersion[]): Weekday[] {
  return schedule.findLast((version) => version.days.length)?.days ?? [...allWeekdays];
}
export function scheduleLabel(days: Weekday[]): string {
  if (days.length === 7) return 'Every day';
  return days.map((day) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]).join(' · ');
}
