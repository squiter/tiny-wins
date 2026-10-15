import type { Weekday } from '../../domain/schedule';
import type { HistoryCell } from '../../domain/habit';
import type { LocalDate } from '../../domain/calendar';
import type { WeekStartsOn } from '../../domain/preferences';
import {
  formatCalendarDate,
  formatNumber,
  weekdayHeadings,
  type InterfaceLanguage,
} from './locale';
import {
  translate,
  translateCount,
  translatedFailure,
  type MessageKey,
  type MessageValues,
} from './messages';

export function interfaceCopy(language: InterfaceLanguage) {
  const t = (key: MessageKey, values?: MessageValues) => translate(language, key, values);
  const count = (n: number, one: MessageKey, other: MessageKey) =>
    translateCount(language, n, one, other);
  const date = (day: LocalDate, options: Omit<Intl.DateTimeFormatOptions, 'timeZone'>) =>
    formatCalendarDate(day, language, options);
  const choices = weekdayHeadings(language, 0).map(
    ({ full }) =>
      full[0]!.toLocaleUpperCase(language) + full.slice(1, language === 'pt-BR' ? 3 : 2),
  );
  return {
    language,
    weekdayChoice: (day: Weekday) => choices[day]!,
    progress: (wins: number, planned: number) =>
      t(planned === 1 ? '{wins} of {planned} planned win' : '{wins} of {planned} planned wins', {
        wins,
        planned,
      }),
    t,
    count,
    date,
    number: (value: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(value, language, options),
    failure: (error: unknown, fallback: MessageKey) => translatedFailure(language, error, fallback),
    weekdays: (startsOn: WeekStartsOn) => weekdayHeadings(language, startsOn),
    cellLabel: (cell: HistoryCell) => {
      const state: MessageKey =
        cell.state === 'complete'
          ? 'completed'
          : cell.state === 'grace'
            ? 'within streak tolerance'
            : cell.state === 'not-scheduled'
              ? 'not scheduled'
              : cell.state === 'before-start'
                ? 'before habit started'
                : cell.state === 'future'
                  ? 'future'
                  : cell.today
                    ? 'pending'
                    : 'not completed';
      return `${date(cell.day, { year: 'numeric', month: '2-digit', day: '2-digit' })}: ${t(state)}${cell.today ? t(', today') : ''}${cell.hasNote ? t(', has note') : ''}`;
    },
  };
}
