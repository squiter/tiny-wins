import { describe, expect, it } from 'vitest';
import { resolveAppearance, validateAppearance } from '../../src/domain/preferences';
import { darkPalette, lightPalette } from '../../src/theme/tokens';
function contrast(a: string, b: string) {
  const luminance = (hex: string) => {
    const rgb = [1, 3, 5]
      .map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
      .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
    return rgb[0]! * 0.2126 + rgb[1]! * 0.7152 + rgb[2]! * 0.0722;
  };
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
describe('saved appearance', () => {
  it('follows system changes with a light fallback and respects explicit overrides', () => {
    expect(resolveAppearance('system', 'dark')).toBe('dark');
    expect(resolveAppearance('system', 'light')).toBe('light');
    expect(resolveAppearance('system', null)).toBe('light');
    expect(resolveAppearance('system', 'unspecified')).toBe('light');
    expect(resolveAppearance('dark', 'light')).toBe('dark');
    expect(resolveAppearance('light', 'dark')).toBe('light');
    for (const invalid of [null, 'auto', 1, {}, undefined])
      expect(() => validateAppearance(invalid)).toThrow();
  });
  it.each([lightPalette, darkPalette])(
    'keeps readable text and state cues in $scheme',
    ({ theme, habitColors, habitSurfaces }) => {
      for (const background of [
        theme.ivory,
        theme.surface,
        theme.mint,
        theme.progress,
        theme.celebration,
        theme.frequency,
        theme.stone,
      ]) {
        expect(contrast(theme.charcoal, background)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(theme.muted, background)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(theme.forest, background)).toBeGreaterThanOrEqual(4.5);
      }
      expect(contrast(theme.onPrimary, theme.forest)).toBeGreaterThanOrEqual(4.5);
      for (const key of Object.keys(habitColors) as (keyof typeof habitColors)[]) {
        expect(contrast(theme.onHabit, habitColors[key])).toBeGreaterThanOrEqual(4.5);
        expect(contrast(habitColors[key], theme.surface)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(theme.muted, habitSurfaces[key])).toBeGreaterThanOrEqual(4.5);
        expect(contrast(theme.forest, habitSurfaces[key])).toBeGreaterThanOrEqual(4.5);
      }
    },
  );
});
