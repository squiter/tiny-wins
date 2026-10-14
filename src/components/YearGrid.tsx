import { calendarOffset, calendarWeekdays, type WeekStartsOn } from '../domain/preferences';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { HistoryCell, ColorKey } from '../domain/habit';
import { habitColors, habitSurfaces, theme } from '../theme/tokens';
import type { LocalDate } from '../domain/calendar';
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export function YearGrid({
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
  return (
    <View style={styles.year}>
      {months.map((month, index) => {
        const days = cells.filter((cell) => Number(cell.day.slice(5, 7)) === index + 1);
        const offset = days[0] ? calendarOffset(days[0].day, weekStartsOn) : 0;
        return (
          <View key={month} style={styles.month}>
            <Text accessibilityRole="header" style={styles.title}>
              {month}
            </Text>
            <View style={styles.days}>
              {calendarWeekdays(weekStartsOn).map((label, i) => (
                <Text accessible={false} key={`label-${i}`} style={styles.weekday}>
                  {label}
                </Text>
              ))}
              {Array.from({ length: offset }, (_, i) => (
                <View key={`blank-${i}`} style={styles.cell} />
              ))}
              {days.map((cell) => (
                <Pressable
                  key={cell.day}
                  testID={`day-${cell.day}`}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: cell.state === 'future' }}
                  disabled={cell.state === 'future'}
                  accessibilityLabel={`${cell.day}: ${cell.state === 'grace' ? 'within streak tolerance' : cell.state.replaceAll('-', ' ')}${cell.today ? ', today' : ''}`}
                  onPress={() => onInspect(cell.day)}
                  style={[
                    styles.cell,
                    {
                      backgroundColor:
                        cell.state === 'complete'
                          ? habitColors[color]
                          : cell.state === 'grace'
                            ? habitSurfaces[color]
                            : theme.ivory,
                      borderWidth: cell.today ? 2 : cell.state === 'not-scheduled' ? 1 : 0,
                      borderColor: cell.today ? habitColors[color] : theme.stone,
                      borderStyle: cell.state === 'not-scheduled' ? 'dashed' : 'solid',
                    },
                  ]}
                >
                  <Text
                    maxFontSizeMultiplier={1}
                    style={{
                      fontSize: 7,
                      color: cell.state === 'complete' ? '#FFFFFF' : theme.muted,
                    }}
                  >
                    {cell.state === 'complete'
                      ? '✓'
                      : cell.state === 'grace'
                        ? '○'
                        : cell.state === 'not-scheduled'
                          ? '–'
                          : cell.today
                            ? '•'
                            : ''}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  year: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  month: {
    width: '48%',
    flexGrow: 1,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.stone,
    gap: 10,
  },
  title: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: theme.forest },
  days: { flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  weekday: {
    width: '12.8%',
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    fontSize: 8,
    color: theme.muted,
    marginBottom: 2,
  },
  cell: {
    width: '12.8%',
    aspectRatio: 1,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
