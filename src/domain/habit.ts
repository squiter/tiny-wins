import { shiftDay, type LocalDate } from './calendar';

export const colorKeys = ['forest', 'blue', 'coral', 'violet', 'teal', 'amber'] as const;
export type ColorKey = (typeof colorKeys)[number];
export const iconKeys = [
  'plant',
  'water',
  'book',
  'walk',
  'stretch',
  'sun',
  'moon',
  'heart',
  'coffee',
  'study',
  'music',
  'smile',
] as const;
export type IconKey = (typeof iconKeys)[number];
export interface Habit {
  id: string;
  title: string;
  color: ColorKey;
  icon: IconKey;
  archivedAt: string | null;
  sortOrder: number;
  startsOn: LocalDate;
  createdAt: string;
}
export interface Completion {
  habitId: string;
  localDate: LocalDate;
  timezone: string;
  completedAt: string;
}
export interface HistoryCell {
  day: LocalDate;
  today: boolean;
  state: 'complete' | 'missed' | 'before-start';
}
export function habitTitle(value: string): string {
  const title = value.trim();
  if (!title || title.length > 80) throw new Error('Use a habit name of 1–80 characters.');
  return title;
}
export function history(habit: Habit, completions: Completion[], today: LocalDate): HistoryCell[] {
  const completed = new Set(
    completions.filter((c) => c.habitId === habit.id).map((c) => c.localDate),
  );
  return Array.from({ length: 14 }, (_, index) => {
    const day = shiftDay(today, index - 13);
    return {
      day,
      today: day === today,
      state: completed.has(day) ? 'complete' : day < habit.startsOn ? 'before-start' : 'missed',
    };
  });
}
export function currentStreak(habit: Habit, completions: Completion[], today: LocalDate): number {
  const completed = new Set(
    completions.filter((c) => c.habitId === habit.id).map((c) => c.localDate),
  );
  let day = completed.has(today) ? today : shiftDay(today, -1);
  let streak = 0;
  while (day >= habit.startsOn && completed.has(day)) {
    streak += 1;
    day = shiftDay(day, -1);
  }
  return streak;
}

export function habitAppearance(color: ColorKey, icon: IconKey) {
  if (!colorKeys.includes(color) || !iconKeys.includes(icon))
    throw new Error('Choose a valid color and icon.');
}

export function moveHabitOrder(habits: Habit[], id: string, direction: -1 | 1): string[] {
  const active = habits.filter((habit) => !habit.archivedAt);
  const index = active.findIndex((habit) => habit.id === id);
  if (index < 0) throw new Error('Habit not found.');
  const target = index + direction;
  if (target >= 0 && target < active.length)
    [active[index], active[target]] = [active[target]!, active[index]!];
  return active.map((habit) => habit.id);
}
export function validateHabitOrder(habits: Habit[], ids: string[]) {
  const active = habits.filter((habit) => !habit.archivedAt);
  if (
    active.length !== ids.length ||
    new Set(ids).size !== ids.length ||
    active.some((habit) => !ids.includes(habit.id))
  )
    throw new Error('Order must include each active habit exactly once.');
}
