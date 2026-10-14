import { describe, expect, it } from 'vitest';
import { noteText } from '../../src/domain/notes';
import { dateKey } from '../../src/domain/calendar';
import { parseBackup, serializeBackup } from '../../src/domain/backup';
import { calendarCells, history, type Habit } from '../../src/domain/habit';
import { habitMetrics } from '../../src/domain/metrics';
const day = dateKey('2026-10-14');
const habit: Habit = {
  id: 'read',
  title: 'Read',
  color: 'blue',
  icon: 'book',
  startsOn: day,
  createdAt: '2026-10-14T12:00:00Z',
  archivedAt: null,
  sortOrder: 0,
  schedule: [{ from: day, days: [0, 1, 2, 3, 4, 5, 6], streakTolerance: 1 }],
};
const note = {
  habitId: habit.id,
  localDate: day,
  text: 'A quiet chapter. 🌱',
  updatedAt: '2026-10-14T13:00:00Z',
};
describe('contextual day notes', () => {
  it('trims plain text, permits explicit clearing and bounds text', () => {
    expect(noteText('  First\nchapter 🌱  ')).toBe('First\nchapter 🌱');
    expect(noteText('  ')).toBe('');
    expect(noteText('x'.repeat(280))).toHaveLength(280);
    expect(() => noteText('x'.repeat(281))).toThrow('280');
  });
  it('annotates the original date without changing binary state, metrics or 14-cell history', () => {
    const cells = calendarCells(habit, [], day, day, day, [note, { ...note, habitId: 'other' }]);
    expect(cells[0]).toMatchObject({ day, state: 'missed', hasNote: true });
    expect(history(habit, [], day, [note])).toHaveLength(14);
    expect(history(habit, [], day, [note]).filter((cell) => cell.hasNote)).toHaveLength(1);
    expect(habitMetrics(habit, [], day)).toMatchObject({
      totalWins: 0,
      currentStreak: 0,
      consistency: 0,
    });
  });
  it('roundtrips v3 notes and tolerance; imports v1/v2 without notes', () => {
    const encoded = serializeBackup([habit], [], new Date(note.updatedAt), [note]);
    expect(parseBackup(encoded).notes).toEqual([note]);
    expect(parseBackup(encoded).habits[0]?.schedule[0]?.streakTolerance).toBe(1);
    for (const version of [1, 2]) {
      const data = JSON.parse(encoded);
      data.version = version;
      delete data.notes;
      expect(parseBackup(JSON.stringify(data)).notes).toEqual([]);
    }
  });
  it('rejects malformed, duplicate, dangling and pre-creation notes before writes', () => {
    const source = () => JSON.parse(serializeBackup([habit], [], new Date(note.updatedAt), [note]));
    for (const invalid of [
      { ...note, text: '' },
      { ...note, text: ' ' },
      { ...note, text: 'x'.repeat(281) },
      { ...note, habitId: 'missing' },
      { ...note, localDate: '2026-10-13' },
      { ...note, localDate: '2026-02-30' },
      { ...note, updatedAt: 'bad' },
    ]) {
      const data = source();
      data.notes = [invalid];
      expect(() => parseBackup(JSON.stringify(data))).toThrow();
    }
    const data = source();
    data.notes.push(note);
    expect(() => parseBackup(JSON.stringify(data))).toThrow('duplicate');
    delete data.notes;
    expect(() => parseBackup(JSON.stringify(data))).toThrow('notes');
  });
});
