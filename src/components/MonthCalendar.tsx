import { useI18n } from '../features/localization/provider';
import { NoteMarker } from './NoteMarker';
import { calendarOffset, type WeekStartsOn } from '../domain/preferences';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { HistoryCell, ColorKey } from '../domain/habit';
import type { LocalDate } from '../domain/calendar';
import { useTheme, useThemeStyles } from '../theme/useTheme';
import type { ThemePalette } from '../theme/tokens';
export function MonthCalendar({
  cells,
  color,
  onInspect,
  weekStartsOn,
}: {
  cells: HistoryCell[];
  color: ColorKey;
  weekStartsOn: WeekStartsOn;
  onInspect(day: LocalDate): void;
}) {
  const { cellLabel, weekdays } = useI18n();
  const { theme, habitColors, habitSurfaces } = useTheme();
  const styles = useThemeStyles(createStyles, theme);
  const offset = cells[0] ? calendarOffset(cells[0].day, weekStartsOn) : 0;
  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        {weekdays(weekStartsOn).map(({ short: label }, index) => (
          <Text accessible={false} key={`weekday-${index}`} style={styles.label}>
            {label}
          </Text>
        ))}
      </View>
      {Array.from({ length: Math.ceil((cells.length + offset) / 7) }, (_, row) => (
        <View key={row} style={styles.row}>
          {Array.from({ length: 7 }, (_, column) => {
            const cell = cells[row * 7 + column - offset];
            return cell ? (
              <Pressable
                key={cell.day}
                testID={`month-day-${cell.day}`}
                accessibilityRole="button"
                accessibilityLabel={cellLabel(cell)}
                disabled={cell.state === 'future'}
                accessibilityState={{ disabled: cell.state === 'future' }}
                onPress={() => onInspect(cell.day)}
                style={styles.day}
              >
                <View
                  pointerEvents="none"
                  style={[
                    styles.daySurface,
                    {
                      backgroundColor:
                        cell.state === 'complete'
                          ? habitColors[color]
                          : cell.state === 'grace'
                            ? habitSurfaces[color]
                            : theme.ivory,
                      borderWidth: cell.today ? 2 : 1,
                      borderColor: cell.today ? habitColors[color] : theme.stone,
                      borderStyle: cell.state === 'not-scheduled' ? 'dashed' : 'solid',
                    },
                  ]}
                />
                {cell.hasNote && <NoteMarker completed={cell.state === 'complete'} />}
                <Text
                  maxFontSizeMultiplier={1}
                  style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 12,
                    color: cell.state === 'complete' ? theme.onHabit : theme.muted,
                  }}
                >
                  {Number(cell.day.slice(8))}
                </Text>
                <Text
                  maxFontSizeMultiplier={1}
                  style={{
                    fontSize: 9,
                    color: cell.state === 'complete' ? theme.onHabit : theme.muted,
                  }}
                >
                  {cell.state === 'complete'
                    ? '✓'
                    : cell.state === 'grace'
                      ? '○'
                      : cell.state === 'flexible'
                        ? '◇'
                        : cell.state === 'not-scheduled'
                          ? '–'
                          : ''}
                </Text>
              </Pressable>
            ) : (
              <View key={`blank-${column}`} style={styles.day} />
            );
          })}
        </View>
      ))}
    </View>
  );
}
const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    grid: {
      gap: 4,
      padding: 10,
      backgroundColor: theme.surface,
      borderRadius: 20,
    },
    row: { flexDirection: 'row', gap: 4 },
    daySurface: { ...StyleSheet.absoluteFill, borderRadius: 9 },
    label: {
      flex: 1,
      textAlign: 'center',
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: theme.muted,
      marginVertical: 6,
    },
    day: {
      flex: 1,
      aspectRatio: 1,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
