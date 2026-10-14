import { useCelebrations } from '../features/feedback/provider';
import { NoteMarker } from './NoteMarker';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { HistoryCell, Habit } from '../domain/habit';
import type { LocalDate } from '../domain/calendar';
import { calendarOffset, calendarWeekdays, type WeekStartsOn } from '../domain/preferences';
import type { ReportPeriod } from '../domain/report';
import { useTheme, useThemeStyles } from '../theme/useTheme';
import type { ThemePalette } from '../theme/tokens';
import { HabitIcon } from './HabitIcon';
export function VictoryWall({
  habit,
  cells,
  period,
  weekStartsOn,
  wins,
  eligibleWins,
  eligibleDays,
  onInspect,
  onView,
}: {
  habit: Habit;
  cells: HistoryCell[];
  period: ReportPeriod;
  weekStartsOn: WeekStartsOn;
  wins: number;
  eligibleWins: number;
  eligibleDays: number;
  onInspect(day: LocalDate): void;
  onView(): void;
}) {
  const { theme, habitColors, habitSurfaces } = useTheme();
  const styles = useThemeStyles(createStyles, theme);
  const columns = period === 'year' ? 35 : 7;
  const offset = cells[0] ? calendarOffset(cells[0].day, weekStartsOn) : 0;
  const color = habitColors[habit.color];
  const { event, animationsAllowed } = useCelebrations();
  const lastEvent = useRef(event?.serial ?? 0);
  const scale = useSharedValue(1);
  useEffect(() => {
    const fresh = !!event && event.serial !== lastEvent.current;
    if (event) lastEvent.current = event.serial;
    if (
      fresh &&
      animationsAllowed &&
      event.habitId === habit.id &&
      event.day >= cells[0]!.day &&
      event.day <= cells.at(-1)!.day
    )
      scale.value = withSequence(
        withTiming(1.015, { duration: 140 }),
        withTiming(1, { duration: 200 }),
      );
    if (!animationsAllowed || !event) scale.value = 1;
  }, [event, animationsAllowed, habit.id, cells, scale]);
  const feedback = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const rows = Array.from({ length: Math.ceil((cells.length + offset) / columns) }, (_, row) =>
    Array.from({ length: columns }, (_, column) => cells[row * columns + column - offset]),
  );
  return (
    <Animated.View testID={`victory-wall-${habit.id}`} style={[styles.card, feedback]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${habit.title} progress`}
        onPress={onView}
        style={styles.header}
      >
        <HabitIcon icon={habit.icon} color={habit.color} />
        <View style={styles.identity}>
          <Text style={styles.name}>{habit.title}</Text>
          <Text style={styles.copy}>
            {habit.archivedAt ? 'Archived · ' : ''}
            {wins} win{wins === 1 ? '' : 's'} this {period}
          </Text>
        </View>
        <Text style={[styles.rate, { color }]}>
          {eligibleDays ? `${Math.round((100 * eligibleWins) / eligibleDays)}%` : '—'} ›
        </Text>
      </Pressable>
      {period !== 'year' ? (
        <View style={styles.row}>
          {calendarWeekdays(weekStartsOn).map((label, index) => (
            <Text accessible={false} key={index} style={styles.weekday}>
              {label}
            </Text>
          ))}
        </View>
      ) : (
        <View style={styles.axis}>
          <Text style={styles.copy}>Jan → Dec</Text>
          <Text style={styles.copy}>One tile, one day</Text>
        </View>
      )}
      <View style={styles.wall}>
        {rows.map((row, index) => (
          <View key={index} style={styles.row}>
            {row.map((cell, column) =>
              cell ? (
                <Pressable
                  key={cell.day}
                  testID={`insights-day-${habit.id}-${cell.day}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${habit.title}, ${cell.day}: ${cell.today && cell.state === 'missed' ? 'pending, today' : cell.state === 'grace' ? 'within streak tolerance' : cell.state.replaceAll('-', ' ')}${cell.today && cell.state !== 'missed' ? ', today' : ''}${cell.hasNote ? ', has note' : ''}`}
                  onPress={() => onInspect(cell.day)}
                  style={[
                    styles.tile,
                    period !== 'year' && styles.largeTile,
                    {
                      backgroundColor:
                        cell.state === 'complete'
                          ? color
                          : cell.state === 'grace'
                            ? habitSurfaces[habit.color]
                            : theme.surface,
                      borderColor: cell.today || cell.state === 'missed' ? color : theme.stone,
                      borderStyle:
                        cell.state === 'future' || cell.state === 'not-scheduled'
                          ? 'dashed'
                          : 'solid',
                      borderWidth: cell.today ? 2 : 1,
                    },
                  ]}
                >
                  {cell.hasNote && <NoteMarker completed={cell.state === 'complete'} />}
                  {period !== 'year' && (
                    <Text
                      maxFontSizeMultiplier={1}
                      style={[
                        styles.number,
                        { color: cell.state === 'complete' ? theme.onHabit : theme.muted },
                      ]}
                    >
                      {Number(cell.day.slice(8))}
                    </Text>
                  )}
                  <Text
                    accessible={false}
                    maxFontSizeMultiplier={1}
                    style={{
                      fontSize: period === 'year' ? 5 : 11,
                      lineHeight: period === 'year' ? 7 : 14,
                      color: cell.state === 'complete' ? theme.onHabit : color,
                    }}
                  >
                    {cell.state === 'complete'
                      ? '✓'
                      : cell.state === 'grace'
                        ? '○'
                        : cell.state === 'not-scheduled'
                          ? '–'
                          : cell.state === 'missed'
                            ? '•'
                            : ''}
                  </Text>
                </Pressable>
              ) : (
                <View
                  key={`blank-${column}`}
                  style={[styles.blank, period !== 'year' && styles.largeTile]}
                />
              ),
            )}
          </View>
        ))}
      </View>
      <Text style={styles.copy}>
        {eligibleWins} of {eligibleDays} planned wins
        {eligibleDays > 0 && eligibleWins === eligibleDays ? ' · All planned wins so far ✓' : ''}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Explore ${habit.title} calendar with larger dates`}
        onPress={onView}
        style={styles.explore}
      >
        <Text style={styles.link}>Explore calendar →</Text>
      </Pressable>
    </Animated.View>
  );
}
const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      boxShadow: theme.cardShadow,
      borderWidth: 1,
      borderColor: theme.stone,
      borderRadius: 20,
      padding: 12,
      gap: 10,
    },
    header: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48 },
    identity: { flex: 1 },
    name: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: theme.charcoal },
    copy: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17, color: theme.muted },
    rate: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
    wall: { gap: 2 },
    row: { flexDirection: 'row', gap: 2 },
    tile: {
      flex: 1,
      aspectRatio: 1,
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    blank: { flex: 1, aspectRatio: 1 },
    largeTile: { minHeight: 48, aspectRatio: undefined, borderRadius: 6 },
    number: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
    weekday: {
      flex: 1,
      textAlign: 'center',
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      color: theme.muted,
    },
    axis: { flexDirection: 'row', justifyContent: 'space-between' },
    explore: { minHeight: 48, justifyContent: 'center' },
    link: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: theme.forest },
  });
