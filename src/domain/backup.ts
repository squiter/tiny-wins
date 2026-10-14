import { noteText, type DayNote } from './notes';
import { dateKey } from './calendar';
import {
  habitAppearance,
  habitTitle,
  type ColorKey,
  type Completion,
  type Habit,
  type IconKey,
} from './habit';
import { validateTolerance, validateWeekdays, type ScheduleVersion } from './schedule';
export const backupLimit = 5 * 1024 * 1024;
export interface Backup {
  format: 'tiny-wins';
  version: 1 | 2 | 3;
  exportedAt: string;
  habits: Habit[];
  completions: Completion[];
  notes: DayNote[];
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('This is not a valid Tiny Wins backup.');
  return value as Record<string, unknown>;
}
function text(value: unknown, max = 128): string {
  if (typeof value !== 'string' || !value.length || value.length > max)
    throw new Error('The backup contains an invalid field.');
  return value;
}
function id(value: unknown): string {
  const result = text(value);
  if (!/^[a-zA-Z0-9-]+$/.test(result)) throw new Error('The backup contains an invalid habit ID.');
  return result;
}
function timestamp(value: unknown): string {
  const result = text(value, 30);
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(result) ||
    !Number.isFinite(new Date(result).getTime())
  )
    throw new Error('The backup contains an invalid timestamp.');
  if (new Date(result).toISOString().replace('.000Z', 'Z') !== result.replace('.000Z', 'Z'))
    throw new Error('The backup contains an invalid timestamp.');
  dateKey(result.slice(0, 10));
  return result;
}
function habit(value: unknown, backupVersion: number): Habit {
  const row = object(value);
  const startsOn = dateKey(text(row.startsOn, 10));
  if (Number(startsOn.slice(0, 4)) < 1900)
    throw new Error('The backup contains an unsupported start date.');
  const color = text(row.color) as ColorKey;
  const icon = text(row.icon) as IconKey;
  habitAppearance(color, icon);
  if (!Number.isSafeInteger(row.sortOrder) || (row.sortOrder as number) < 0)
    throw new Error('The backup contains an invalid habit order.');
  if (!Array.isArray(row.schedule) || !row.schedule.length || row.schedule.length > 200)
    throw new Error('The backup contains an invalid schedule.');
  const schedule: ScheduleVersion[] = row.schedule.map((value: unknown) => {
    const version = object(value);
    if (!Array.isArray(version.days)) throw new Error('The backup contains an invalid schedule.');
    const days = version.days.length ? validateWeekdays(version.days) : [];
    return {
      from: dateKey(text(version.from, 10)),
      days,
      ...(backupVersion >= 2 && version.streakTolerance !== undefined
        ? { streakTolerance: validateTolerance(version.streakTolerance) }
        : {}),
    };
  });
  if (
    schedule[0]?.from !== startsOn ||
    schedule.some((version, index) => index > 0 && version.from <= schedule[index - 1]!.from)
  )
    throw new Error('The backup schedule dates are not in order.');
  return {
    id: id(row.id),
    title: habitTitle(text(row.title, 80)),
    color,
    icon,
    startsOn,
    createdAt: timestamp(row.createdAt),
    archivedAt: row.archivedAt === null ? null : timestamp(row.archivedAt),
    sortOrder: row.sortOrder as number,
    schedule,
  };
}
export function parseBackup(source: string): Backup {
  if (new TextEncoder().encode(source).length > backupLimit)
    throw new Error('Choose a backup smaller than 5 MB.');
  let value: unknown;
  try {
    value = JSON.parse(source.replace(/^\uFEFF/, ''));
  } catch {
    throw new Error('This file is not a valid Tiny Wins backup.');
  }
  const data = object(value);
  if (
    data.format !== 'tiny-wins' ||
    (data.version !== 1 && data.version !== 2 && data.version !== 3)
  )
    throw new Error('This backup format is not supported.');
  if (
    !Array.isArray(data.habits) ||
    data.habits.length > 500 ||
    !Array.isArray(data.completions) ||
    data.completions.length > 50000
  )
    throw new Error('This backup has too many records.');
  const habits = data.habits.map((value) => habit(value, data.version as number));
  const map = new Map(habits.map((value) => [value.id, value]));
  if (map.size !== habits.length) throw new Error('The backup contains duplicate habits.');
  const keys = new Set<string>();
  const completions: Completion[] = data.completions.map((value: unknown) => {
    const row = object(value);
    const habitId = id(row.habitId);
    const localDate = dateKey(text(row.localDate, 10));
    const timezone = text(row.timezone, 80);
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    } catch {
      throw new Error('The backup contains an invalid timezone.');
    }
    const owner = map.get(habitId);
    const key = `${habitId}:${localDate}`;
    if (!owner || localDate < owner.startsOn || keys.has(key))
      throw new Error('The backup contains invalid or duplicate wins.');
    keys.add(key);
    return { habitId, localDate, timezone, completedAt: timestamp(row.completedAt) };
  });
  const notes: DayNote[] = [];
  if (data.version === 3) {
    if (!Array.isArray(data.notes) || data.notes.length > 50000)
      throw new Error('The backup contains invalid notes.');
    const noteKeys = new Set<string>();
    for (const value of data.notes) {
      const row = object(value);
      const habitId = id(row.habitId);
      const localDate = dateKey(text(row.localDate, 10));
      const content = noteText(text(row.text, 280));
      const owner = map.get(habitId);
      const key = `${habitId}:${localDate}`;
      if (!content || !owner || localDate < owner.startsOn || noteKeys.has(key))
        throw new Error('The backup contains invalid or duplicate notes.');
      noteKeys.add(key);
      notes.push({ habitId, localDate, text: content, updatedAt: timestamp(row.updatedAt) });
    }
  }
  return {
    format: 'tiny-wins',
    version: data.version as 1 | 2 | 3,
    exportedAt: timestamp(data.exportedAt),
    habits,
    completions,
    notes,
  };
}
export function serializeBackup(
  habits: Habit[],
  completions: Completion[],
  now: Date,
  notes: DayNote[] = [],
): string {
  const source = JSON.stringify(
    { format: 'tiny-wins', version: 3, exportedAt: now.toISOString(), habits, completions, notes },
    null,
    2,
  );
  parseBackup(source);
  return source;
}
