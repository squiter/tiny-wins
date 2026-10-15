import { describe, expect, it } from 'vitest';
import { dateKey, type LocalDate } from '../../src/domain/calendar';
import {
  formatCalendarDate,
  formatNumber,
  pluralForm,
  resolveLanguage,
  validateLanguagePreference,
  weekdayHeadings,
} from '../../src/features/localization/locale';

describe('interface language boundary', () => {
  it('resolves supported device variants and a deterministic English fallback', () => {
    for (const tag of ['pt', 'pt-BR', 'pt-PT', 'pt-AO', 'PT-br'])
      expect(resolveLanguage('system', tag)).toBe('pt-BR');
    for (const tag of ['en', 'en-US', 'en-GB', 'ja-JP', 'es', '', 'not_a_locale', null, undefined])
      expect(resolveLanguage('system', tag)).toBe('en');
  });

  it('explicit overrides win and unsupported stored choices fail validation', () => {
    expect(resolveLanguage('en', 'pt-BR')).toBe('en');
    expect(resolveLanguage('pt-BR', 'en-US')).toBe('pt-BR');
    for (const value of ['pt', 'en-US', 'fr', '', null, undefined, 1])
      expect(() => validateLanguagePreference(value)).toThrow();
    expect(() => resolveLanguage('fr' as 'en', 'pt-BR')).toThrow();
  });

  it('formats leap dates without changing their calendar meaning', () => {
    const day = dateKey('2024-02-29');
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' } as const;
    expect(formatCalendarDate(day, 'en', options)).toBe('02/29/2024');
    expect(formatCalendarDate(day, 'pt-BR', options)).toBe('29/02/2024');
    expect(day).toBe('2024-02-29');
    // Even untyped callers cannot override the local-date display container.
    const untypedOptions = { ...options, timeZone: 'Pacific/Kiritimati' };
    expect(formatCalendarDate(day, 'pt-BR', untypedOptions)).toBe('29/02/2024');
    expect(() => formatCalendarDate('2024-02-30' as LocalDate, 'en', options)).toThrow();
  });

  it('uses language-specific count rules including Portuguese zero', () => {
    expect([0, 1, 2, 14].map((n) => pluralForm(n, 'en'))).toEqual([
      'other',
      'one',
      'other',
      'other',
    ]);
    expect([0, 1, 2, 14].map((n) => pluralForm(n, 'pt-BR'))).toEqual([
      'one',
      'one',
      'other',
      'other',
    ]);
    for (const count of [-1, 1.5, NaN, Infinity]) expect(() => pluralForm(count, 'en')).toThrow();
  });

  it('formats numbers and percentages explicitly for the selected language', () => {
    expect(formatNumber(1234.5, 'en')).toBe('1,234.5');
    expect(formatNumber(1234.5, 'pt-BR')).toBe('1.234,5');
    expect(formatNumber(0.5, 'pt-BR', { style: 'percent' })).toBe('50%');
    for (const value of [NaN, Infinity, -Infinity])
      expect(() => formatNumber(value, 'pt-BR')).toThrow();
  });

  it('formats supported whole-count plurals when the native engine has no Intl.PluralRules', () => {
    const descriptor = Object.getOwnPropertyDescriptor(Intl, 'PluralRules')!;
    Object.defineProperty(Intl, 'PluralRules', { ...descriptor, value: undefined });
    try {
      for (const language of ['en', 'pt-BR'] as const) {
        expect([0, 1, 2, 100, 1_000_000].map((n) => pluralForm(n, language))).toEqual(
          language === 'en'
            ? ['other', 'one', 'other', 'other', 'other']
            : ['one', 'one', 'other', 'other', 'other'],
        );
      }
    } finally {
      Object.defineProperty(Intl, 'PluralRules', descriptor);
    }
  });

  it('rotates seven localized headings without changing the chosen week start', () => {
    const sunday = weekdayHeadings('pt-BR', 0);
    const monday = weekdayHeadings('pt-BR', 1);
    expect(sunday.map((item) => item.weekday)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(monday.map((item) => item.weekday)).toEqual([1, 2, 3, 4, 5, 6, 0]);
    expect(sunday[0]).toEqual({ weekday: 0, short: 'D', full: 'domingo' });
    expect(monday[0]).toEqual({ weekday: 1, short: 'S', full: 'segunda-feira' });
    expect(weekdayHeadings('en', 1)[0]?.full).toBe('Monday');
    expect(() => weekdayHeadings('pt-BR', 2 as 1)).toThrow();
  });
});
