import { describe, expect, it } from 'vitest';
import { dateKey } from '../../src/domain/calendar';
import {
  celebrationMotionAllowed,
  completionCelebration,
  type CheckInOutcome,
} from '../../src/domain/feedback';
import { validateCelebrationAnimations } from '../../src/domain/preferences';
const today = dateKey('2026-10-14');
const win: CheckInOutcome = { habitId: 'read', day: today, completed: true, changed: true };
describe('deliberate completion feedback', () => {
  it('distinguishes an individual win from all positive planned opportunities', () => {
    expect(completionCelebration(win, today, 3, 1)).toBe('win');
    expect(completionCelebration(win, today, 3, 3)).toBe('all-day');
    expect(completionCelebration(win, today, 0, 0)).toBe('win');
    expect(completionCelebration({ ...win, day: dateKey('2026-10-13') }, today, 3, 3)).toBe('win');
  });
  it('never celebrates an undo or a duplicate/idempotent update', () => {
    expect(completionCelebration({ ...win, completed: false }, today, 3, 2)).toBeNull();
    expect(completionCelebration({ ...win, changed: false }, today, 3, 3)).toBeNull();
    expect(
      completionCelebration({ ...win, changed: false, completed: false }, today, 0, 0),
    ).toBeNull();
  });
  it('lets OS reduced motion override the saved animation choice', () => {
    expect(celebrationMotionAllowed(true, false)).toBe(true);
    expect(celebrationMotionAllowed(true, true)).toBe(false);
    expect(celebrationMotionAllowed(false, false)).toBe(false);
    expect(celebrationMotionAllowed(false, true)).toBe(false);
  });
  it('validates the saved animation choice without coercion', () => {
    expect(validateCelebrationAnimations(true)).toBe(true);
    expect(validateCelebrationAnimations(false)).toBe(false);
    for (const invalid of [null, 1, 0, 'true', undefined])
      expect(() => validateCelebrationAnimations(invalid)).toThrow();
  });
});
