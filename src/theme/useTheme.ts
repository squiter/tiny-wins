import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { usePreferences } from '../database/provider';
import { resolveAppearance } from '../domain/preferences';
import { darkPalette, lightPalette, type ThemePalette } from './tokens';
export function useSystemTheme() {
  return useColorScheme() === 'dark' ? darkPalette : lightPalette;
}
export function useTheme() {
  const { appearance } = usePreferences();
  return resolveAppearance(appearance, useColorScheme()) === 'dark' ? darkPalette : lightPalette;
}
export function useThemeStyles<T>(factory: (theme: ThemePalette) => T, theme: ThemePalette): T {
  return useMemo(() => factory(theme), [factory, theme]);
}
