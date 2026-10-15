import { dateKey, type LocalDate } from '../../domain/calendar';
import { validateWeekStart, type WeekStartsOn } from '../../domain/preferences';

export const languagePreferences = ['system', 'en', 'pt-BR'] as const;
export type LanguagePreference = (typeof languagePreferences)[number];
export type InterfaceLanguage = Exclude<LanguagePreference, 'system'>;

export function validateLanguagePreference(value: unknown): LanguagePreference {
  if (value !== 'system' && value !== 'en' && value !== 'pt-BR')
    throw new Error('Choose System, English or Português (Brasil).');
  return value;
}

export function resolveLanguage(
  preference: LanguagePreference,
  preferredDeviceLanguage?: string | null,
): InterfaceLanguage {
  const choice = validateLanguagePreference(preference);
  if (choice !== 'system') return choice;
  try {
    return new Intl.Locale(preferredDeviceLanguage ?? 'en').language === 'pt' ? 'pt-BR' : 'en';
  } catch {
    return 'en';
  }
}

export function formatCalendarDate(
  day: LocalDate,
  language: InterfaceLanguage,
  options: Omit<Intl.DateTimeFormatOptions, 'timeZone'>,
): string {
  return new Intl.DateTimeFormat(language, { ...options, timeZone: 'UTC' }).format(
    new Date(`${dateKey(day)}T12:00:00Z`),
  );
}

export function formatNumber(
  value: number,
  language: InterfaceLanguage,
  options?: Intl.NumberFormatOptions,
): string {
  if (!Number.isFinite(value)) throw new Error('A displayed number must be finite.');
  return new Intl.NumberFormat(language, options).format(value);
}

export function pluralForm(value: number, language: InterfaceLanguage): 'one' | 'other' {
  if (!Number.isInteger(value) || value < 0)
    throw new Error('A displayed count must be a non-negative integer.');
  return new Intl.PluralRules(language).select(value) === 'one' ? 'one' : 'other';
}

export function weekdayHeadings(language: InterfaceLanguage, startsOn: WeekStartsOn) {
  const start = validateWeekStart(startsOn);
  // A fixed Sunday anchors presentation only; schedule dates never pass through this helper.
  return Array.from({ length: 7 }, (_, index) => {
    const weekday = (start + index) % 7;
    const day = dateKey(`2024-01-${String(7 + weekday).padStart(2, '0')}`);
    return {
      weekday,
      short: formatCalendarDate(day, language, { weekday: 'narrow' }),
      full: formatCalendarDate(day, language, { weekday: 'long' }),
    };
  });
}
