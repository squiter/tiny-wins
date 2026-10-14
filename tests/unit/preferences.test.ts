import { describe, expect, it } from 'vitest';
import { dateKey } from '../../src/domain/calendar';
import { calendarOffset, calendarWeekdays, validateWeekStart } from '../../src/domain/preferences';
describe('calendar presentation preferences', () => {
  it('aligns a month starting on Sunday for both week starts', () => {
    expect(calendarOffset(dateKey('2026-11-01'), 0)).toBe(0);
    expect(calendarOffset(dateKey('2026-11-01'), 1)).toBe(6);
  });
  it('aligns Monday and leap day without changing the date', () => {
    expect(calendarOffset(dateKey('2024-01-01'), 1)).toBe(0);
    expect(calendarOffset(dateKey('2024-01-01'), 0)).toBe(1);
    expect(calendarOffset(dateKey('2024-02-29'), 1)).toBe(3);
    expect(calendarOffset(dateKey('2024-02-29'), 0)).toBe(4);
  });
  it('rotates all seven headings consistently', () => {
    expect(calendarWeekdays(0)).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
    expect(calendarWeekdays(1)).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
  });
  it('rejects unsupported and untyped preference values', () => {
    for (const value of [2, -1, 7, '0', null, undefined])
      expect(() => validateWeekStart(value)).toThrow();
  });
});
