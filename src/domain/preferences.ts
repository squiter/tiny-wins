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

export const appearanceOptions = ['system', 'light', 'dark'] as const;
export type Appearance = (typeof appearanceOptions)[number];
export function validateAppearance(value: unknown): Appearance {
  if (value !== 'system' && value !== 'light' && value !== 'dark')
    throw new Error('Choose System, Light or Dark appearance.');
  return value;
}
export function resolveAppearance(
  value: Appearance,
  systemScheme: 'light' | 'dark' | 'unspecified' | null | undefined,
): 'light' | 'dark' {
  return value === 'system'
    ? systemScheme === 'dark'
      ? 'dark'
      : 'light'
    : (validateAppearance(value) as 'light' | 'dark');
}

export function validateCelebrationAnimations(value: unknown): boolean {
  if (typeof value !== 'boolean')
    throw new Error('Choose whether celebration animations are enabled.');
  return value;
}
