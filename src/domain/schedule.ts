import { shiftDay, type LocalDate } from './calendar';
import { calendarOffset, validateWeekStart, type WeekStartsOn } from './preferences';
export const allWeekdays = [0, 1, 2, 3, 4, 5, 6] as const;
export type Weekday = (typeof allWeekdays)[number];
export interface WeeklyGoal {
  target: number;
  weekStartsOn: WeekStartsOn;
}
export interface ScheduleVersion {
  from: LocalDate;
  days: Weekday[];
  streakTolerance?: number;
  weekly?: WeeklyGoal;
  resumeDays?: Weekday[];
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
  streakTolerance = plannedTolerance(schedule),
  weekly?: WeeklyGoal,
): ScheduleVersion[] {
  return [
    ...schedule.filter((version) => version.from < from),
    {
      from,
      days: [...days],
      ...(weekly ? { weekly: validateWeeklyGoal(weekly) } : {}),
      ...(validateTolerance(streakTolerance) > 0 ? { streakTolerance } : {}),
    },
  ];
}
export function plannedDays(schedule: ScheduleVersion[]): Weekday[] {
  return plannedVersion(schedule).days;
}
export function scheduleLabel(days: Weekday[]): string {
  if (days.length === 7) return 'Every day';
  return days.map((day) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]).join(' · ');
}

export function validateTolerance(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 7)
    throw new Error('Choose a streak tolerance from 0 to 7 scheduled days.');
  return value;
}
export function plannedTolerance(schedule: ScheduleVersion[]): number {
  return schedule.at(-1)?.streakTolerance ?? 0;
}
export function toleranceOn(schedule: ScheduleVersion[], day: LocalDate): number {
  return schedule.findLast((version) => version.from <= day)?.streakTolerance ?? 0;
}

export function versionOn(schedule: ScheduleVersion[], day: LocalDate) {
  return schedule.findLast((version) => version.from <= day);
}
export function plannedVersion(schedule: ScheduleVersion[]): ScheduleVersion {
  const version =
    schedule.findLast((item) => item.days.length > 0 || item.resumeDays?.length) ?? schedule[0]!;
  return {
    ...version,
    days: version.resumeDays ?? (version.days.length ? version.days : [...allWeekdays]),
  };
}
export function validateWeeklyGoal(value: unknown): WeeklyGoal {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Choose a weekly goal from 1 to 7 days.');
  const { target, weekStartsOn } = value as Record<string, unknown>;
  if (typeof target !== 'number' || !Number.isInteger(target) || target < 1 || target > 7)
    throw new Error('Choose a weekly goal from 1 to 7 days.');
  return { target, weekStartsOn: validateWeekStart(weekStartsOn) };
}
export function weekStart(day: LocalDate, startsOn: WeekStartsOn): LocalDate {
  return shiftDay(day, -calendarOffset(day, startsOn));
}
export function nextWeek(day: LocalDate, startsOn: WeekStartsOn): LocalDate {
  return shiftDay(weekStart(day, startsOn), 7);
}
export function validateSchedulePolicies(schedule: ScheduleVersion[]) {
  for (let index = 0; index < schedule.length; index += 1) {
    const version = schedule[index]!;
    if (version.resumeDays !== undefined) {
      validateWeekdays(version.resumeDays);
      if (version.days.length || (version.weekly && version.resumeDays.length !== 7))
        throw new Error('The backup contains an invalid weekly policy.');
    }
    if (version.weekly) {
      validateWeeklyGoal(version.weekly);
      if (
        (version.days.length !== 0 && version.days.length !== 7) ||
        (version.streakTolerance ?? 0) !== 0
      )
        throw new Error('The backup contains an invalid weekly policy.');
    }
    const previous = schedule[index - 1];
    if (!previous) continue;
    const weekly = previous.weekly ?? version.weekly;
    const changed =
      !!previous.weekly !== !!version.weekly ||
      (previous.weekly &&
        version.weekly &&
        JSON.stringify(previous.weekly) !== JSON.stringify(version.weekly));
    if (weekly && changed && version.from !== weekStart(version.from, weekly.weekStartsOn))
      throw new Error('Weekly policy changes must start at a week boundary.');
    if (
      previous.weekly &&
      version.weekly &&
      previous.weekly.weekStartsOn !== version.weekly.weekStartsOn
    )
      throw new Error('Keep the saved weekly boundary.');
  }
}
