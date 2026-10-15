import { describe, expect, it } from 'vitest';
import { dateKey } from '../../src/domain/calendar';
import { history, type Habit } from '../../src/domain/habit';
import { allWeekdays } from '../../src/domain/schedule';
import {
  portuguese,
  translate,
  translatedFailure,
  type MessageKey,
} from '../../src/features/localization/messages';
import { interfaceCopy } from '../../src/features/localization/presentation';

const placeholders = (value: string) =>
  [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
describe('localized interface copy', () => {
  it('provides nonempty Portuguese and matching interpolation slots for every English message', () => {
    for (const [english, pt] of Object.entries(portuguese)) {
      expect(pt.trim(), english).not.toBe('');
      expect(placeholders(pt), english).toEqual(placeholders(english));
      const values = Object.fromEntries(placeholders(english).map((name) => [name!, 'á']));
      expect(translate('en', english as MessageKey, values)).not.toContain('{');
      expect(translate('pt-BR', english as MessageKey, values)).not.toContain('{');
    }
    expect(() => translate('pt-BR', 'Restore {title}')).toThrow('Missing message value');
  });

  it('interpolates user-entered text literally without translating or recursively interpreting it', () => {
    const title = 'Read {count} à noite';
    expect(translate('pt-BR', 'Restore {title}', { title })).toBe(`Restaurar ${title}`);
    expect(title).toBe('Read {count} à noite');
    expect(interfaceCopy('pt-BR').count(2, '{count} win', '{count} wins')).toBe('2 vitórias');
    expect(interfaceCopy('en').count(1, '{count} win', '{count} wins')).toBe('1 win');
  });

  it('translates known validation errors and uses an actionable fallback for unknown platform errors', () => {
    expect(
      translatedFailure(
        'pt-BR',
        new Error('Choose a backup smaller than 5 MB.'),
        'Could not read this backup.',
      ),
    ).toBe('Escolha um backup menor que 5 MB.');
    const privateError = new Error('Internal platform failure /private/habit-data.db');
    expect(translatedFailure('pt-BR', privateError, 'Could not read this backup.')).toBe(
      portuguese['Could not read this backup.'],
    );
    expect(translatedFailure('en', null, 'Could not create a backup.')).toBe(
      'Could not create a backup.',
    );
  });

  it('describes all 14 unchanged calendar cells with translated states and non-color note/today cues', () => {
    const day = dateKey('2026-10-15');
    const habit: Habit = {
      id: 'read',
      title: 'Read',
      color: 'forest',
      icon: 'book',
      startsOn: day,
      createdAt: '2026-10-15T12:00:00Z',
      archivedAt: null,
      sortOrder: 0,
      schedule: [{ from: day, days: [...allWeekdays] }],
    };
    const cells = history(habit, [], day, [
      { habitId: habit.id, localDate: day, text: 'Note', updatedAt: habit.createdAt },
    ]);
    expect(cells).toHaveLength(14);
    const original = structuredClone(cells);
    const copy = interfaceCopy('pt-BR');
    expect(copy.cellLabel(cells[13]!)).toBe('15/10/2026: pendente, hoje, com nota');
    expect(copy.cellLabel(cells[0]!)).toContain('antes do início do hábito');
    expect(cells).toEqual(original);
    expect(interfaceCopy('en').cellLabel(cells[13]!)).toBe('10/15/2026: pending, today, has note');
  });
});
