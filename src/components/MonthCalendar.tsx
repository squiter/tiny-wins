import { calendarOffset, calendarWeekdays, type WeekStartsOn } from '../domain/preferences';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { HistoryCell, ColorKey } from '../domain/habit';
import type { LocalDate } from '../domain/calendar';
import { habitColors, habitSurfaces, theme } from '../theme/tokens';
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
  const offset = cells[0] ? calendarOffset(cells[0].day, weekStartsOn) : 0;
  return (
    <View style={styles.grid}>
      {calendarWeekdays(weekStartsOn).map((label, index) => (
        <Text accessible={false} key={`weekday-${index}`} style={styles.label}>
          {label}
        </Text>
      ))}
      {Array.from({ length: offset }, (_, index) => (
        <View key={`empty-${index}`} style={styles.day} />
      ))}
      {cells.map((cell) => (
        <Pressable
          key={cell.day}
          testID={`month-day-${cell.day}`}
          accessibilityRole="button"
          accessibilityLabel={`${cell.day}: ${cell.state.replaceAll('-', ' ')}${cell.today ? ', today' : ''}`}
          disabled={cell.state === 'future'}
          accessibilityState={{ disabled: cell.state === 'future' }}
          onPress={() => onInspect(cell.day)}
          style={[
            styles.day,
            {
              backgroundColor:
                cell.state === 'complete'
                  ? habitColors[color]
                  : cell.state === 'missed'
                    ? habitSurfaces[color]
                    : theme.ivory,
              borderWidth: cell.today ? 2 : 1,
              borderColor: cell.today ? habitColors[color] : theme.stone,
              borderStyle: cell.state === 'not-scheduled' ? 'dashed' : 'solid',
            },
          ]}
        >
          <Text
            maxFontSizeMultiplier={1}
            style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 12,
              color: cell.state === 'complete' ? '#FFFFFF' : theme.muted,
            }}
          >
            {Number(cell.day.slice(8))}
          </Text>
          <Text
            maxFontSizeMultiplier={1}
            style={{ fontSize: 9, color: cell.state === 'complete' ? '#FFFFFF' : theme.muted }}
          >
            {cell.state === 'complete' ? '✓' : cell.state === 'not-scheduled' ? '–' : ''}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  label: {
    width: '13.1%',
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: theme.muted,
    marginVertical: 6,
  },
  day: {
    width: '13.1%',
    aspectRatio: 1,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
