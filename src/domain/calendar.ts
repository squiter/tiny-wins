export type LocalDate = string & { readonly __localDate: unique symbol };

export function dateKey(value: string): LocalDate {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Invalid calendar date');
  const parsed = new Date(`${value}T12:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value)
    throw new Error('Invalid calendar date');
  return value as LocalDate;
}

export function localDay(now: Date, timezone: string): LocalDate {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)?.value;
  return dateKey(`${part('year')}-${part('month')}-${part('day')}`);
}

// UTC is only an arithmetic container; completion dates are immutable local dates.
export function shiftDay(day: LocalDate, offset: number): LocalDate {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return dateKey(date.toISOString().slice(0, 10));
}
