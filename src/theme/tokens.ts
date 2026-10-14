export const theme = {
  ivory: '#FAF8F4',
  forest: '#294B3B',
  sage: '#8FB9A0',
  mint: '#CFE2D6',
  apricot: '#F2BE91',
  charcoal: '#2F2F2F',
  muted: '#526057',
  surface: '#FFFFFF',
  rest: '#F0EEEA',
  cardBorder: '#EBE8E2',
  progress: '#E7EDE4',
  celebration: '#F8EBCF',
  track: '#CEDACB',
  frequency: '#ECEFE8',
  onPrimary: '#FFFFFF',
  onHabit: '#FFFFFF',
  overlay: '#00000044',
  stone: '#E7E3DC',
};
export const habitColors = {
  forest: '#294B3B',
  blue: '#3666A2',
  coral: '#A34439',
  violet: '#725499',
  teal: '#24756B',
  amber: '#89600D',
};
export const habitSurfaces = {
  forest: '#E3ECE5',
  blue: '#E3F0FB',
  coral: '#FBE7E2',
  violet: '#EFE7F6',
  teal: '#DFEFEA',
  amber: '#FCF0D9',
};

export type ThemePalette = { [Key in keyof typeof theme]: string };
export const darkTheme: ThemePalette = {
  ivory: '#141B17',
  forest: '#ABD5B8',
  sage: '#8FB9A0',
  mint: '#243A2D',
  apricot: '#F2BE91',
  charcoal: '#F4F1EA',
  muted: '#BBC7BE',
  stone: '#3C4C42',
  surface: '#202B24',
  rest: '#29332D',
  cardBorder: '#405046',
  progress: '#24382B',
  celebration: '#3B3320',
  track: '#49604F',
  frequency: '#29382D',
  onPrimary: '#142018',
  onHabit: '#142018',
  overlay: '#00000088',
};
export const darkHabitColors: typeof habitColors = {
  forest: '#ABD5B8',
  blue: '#9DC7F5',
  coral: '#F5ADA3',
  violet: '#CCB2F2',
  teal: '#86D3C4',
  amber: '#E7C073',
};
export const darkHabitSurfaces: typeof habitSurfaces = {
  forest: '#304737',
  blue: '#293C52',
  coral: '#4E332F',
  violet: '#40334E',
  teal: '#27463D',
  amber: '#4B3F29',
};
export const lightPalette = { theme, habitColors, habitSurfaces, scheme: 'light' as const };
export const darkPalette = {
  theme: darkTheme,
  habitColors: darkHabitColors,
  habitSurfaces: darkHabitSurfaces,
  scheme: 'dark' as const,
};
