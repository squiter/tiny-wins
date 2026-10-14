import { useCelebrations } from '../features/feedback/provider';
import type { DayNote } from '../domain/notes';
import { NoteMarker } from './NoteMarker';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { currentStreak, history, type Completion, type Habit } from '../domain/habit';
import type { LocalDate } from '../domain/calendar';
import { scheduledOn } from '../domain/schedule';
import { useTheme, useThemeStyles } from '../theme/useTheme';
import type { ThemePalette } from '../theme/tokens';
import { HabitIcon } from './HabitIcon';
interface Props {
  habit: Habit;
  completions: Completion[];
  notes: DayNote[];
  today: LocalDate;
  onToggle(): void;
  onView(): void;
  onInspect(day: LocalDate): void;
  ordering?: { first: boolean; last: boolean; move(direction: -1 | 1): void };
}
export function HabitCard({
  habit,
  completions,
  notes,
  today,
  onToggle,
  onView,
  onInspect,
  ordering,
}: Props) {
  const { theme, habitColors, habitSurfaces } = useTheme();
  const styles = useThemeStyles(createStyles, theme);
  const cells = history(habit, completions, today, notes);
  const due = scheduledOn(habit.schedule, today);
  const done = cells[13]?.state === 'complete';
  const color = habitColors[habit.color];
  const { event, animationsAllowed } = useCelebrations();
  const lastEvent = useRef(event?.serial ?? 0);
  const sparkle = useSharedValue(0);
  const scale = useSharedValue(1);
  useEffect(() => {
    const fresh = !!event && event.serial !== lastEvent.current;
    if (event) lastEvent.current = event.serial;
    if (fresh && animationsAllowed && event.habitId === habit.id && event.day === today) {
      scale.value = withSequence(
        withTiming(1.12, { duration: 120 }),
        withTiming(1.02, { duration: 120 }),
        withTiming(1, { duration: 160 }),
      );
      sparkle.value = withSequence(
        withTiming(1, { duration: 140 }),
        withTiming(0, { duration: 650 }),
      );
    }
    if (!animationsAllowed || !event) {
      scale.value = 1;
      sparkle.value = 0;
    }
  }, [event, animationsAllowed, habit.id, today, scale, sparkle]);
  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkle.value,
    transform: [{ translateY: -12 * (1 - sparkle.value) }, { scale: 0.8 + 0.2 * sparkle.value }],
  }));
  const feedbackStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const streak = currentStreak(habit, completions, today);
  return (
    <Animated.View
      layout={LinearTransition.duration(180).reduceMotion(ReduceMotion.System)}
      style={styles.card}
      testID={`habit-${habit.id}`}
    >
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ${habit.title}, ${due ? `${streak} win${streak === 1 ? '' : 's'} in a row` : 'Not scheduled today'}`}
          disabled={!!ordering}
          onPress={onView}
          style={styles.edit}
        >
          <View style={ordering && { opacity: 0 }}>
            <HabitIcon icon={habit.icon} color={habit.color} />
          </View>
          <View style={styles.titleBlock}>
            <Text numberOfLines={2} style={styles.title}>
              {habit.title}
            </Text>
            <Text style={styles.support}>
              {due ? `${streak} win${streak === 1 ? '' : 's'} in a row` : 'Not scheduled today'}
            </Text>
          </View>
        </Pressable>
        {ordering ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Move ${habit.title} down`}
            accessibilityState={{ disabled: ordering.last }}
            disabled={ordering.last}
            onPress={() => ordering.move(1)}
            style={[styles.check, styles.move, ordering.last && { opacity: 0.35 }]}
          >
            <Text style={styles.arrow}>↓</Text>
          </Pressable>
        ) : (
          <Animated.View style={feedbackStyle}>
            <Pressable
              testID={`complete-${habit.id}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: done, disabled: !due && !done }}
              aria-checked={done}
              accessibilityLabel={`${done ? 'Undo' : 'Complete'} ${habit.title} today`}
              disabled={!due && !done}
              onPress={onToggle}
              style={[
                styles.check,
                {
                  borderColor: done ? color : theme.stone,
                  backgroundColor: done ? color : theme.ivory,
                },
              ]}
            >
              <Animated.View key={done ? 'done' : 'pending'}>
                <Text
                  maxFontSizeMultiplier={1}
                  style={{ color: done ? theme.onHabit : color, fontSize: 23 }}
                >
                  {done ? '✓' : due ? '+' : '–'}
                </Text>
              </Animated.View>
            </Pressable>
          </Animated.View>
        )}
        {ordering && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Move ${habit.title} up`}
            accessibilityState={{ disabled: ordering.first }}
            disabled={ordering.first}
            onPress={() => ordering.move(-1)}
            style={[styles.check, styles.move, styles.up, ordering.first && { opacity: 0.35 }]}
          >
            <Text style={styles.arrow}>↑</Text>
          </Pressable>
        )}
      </View>
      <Animated.Text
        testID={`win-sparkle-${habit.id}`}
        accessible={false}
        aria-hidden={true}
        pointerEvents="none"
        maxFontSizeMultiplier={1}
        style={[styles.sparkle, { color }, sparkleStyle]}
      >
        ✧
      </Animated.Text>
      <View style={styles.grid}>
        {cells.map((cell) => {
          const label = `${cell.day}: ${cell.state === 'complete' ? 'completed' : cell.state === 'before-start' || cell.state === 'not-scheduled' ? (cell.state === 'not-scheduled' ? 'not scheduled' : 'before habit started') : cell.state === 'grace' ? 'within streak tolerance' : cell.today ? 'pending' : 'not completed'}${cell.today ? ', today' : ''}${cell.hasNote ? ', has note' : ''}`;
          const style = [
            styles.cell,
            {
              backgroundColor:
                cell.state === 'complete'
                  ? color
                  : cell.state === 'before-start' || cell.state === 'not-scheduled'
                    ? theme.rest
                    : cell.state === 'grace'
                      ? habitSurfaces[habit.color]
                      : theme.ivory,
              borderColor: cell.today ? color : 'transparent',
              borderWidth: cell.today ? 2 : 0,
            },
          ];
          return cell.today ? (
            <Pressable
              key={cell.day}
              disabled={!due && !done}
              onPress={onToggle}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: done, disabled: !due && !done }}
              aria-checked={done}
              accessibilityLabel={`${habit.title}, ${label}`}
              hitSlop={6}
              style={style}
            >
              {cell.hasNote && <NoteMarker completed={cell.state === 'complete'} />}
              <Text
                maxFontSizeMultiplier={1}
                style={[styles.cellMark, { color: done ? theme.onHabit : color }]}
              >
                {done ? '✓' : due ? '•' : '–'}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              key={cell.day}
              onPress={() => onInspect(cell.day)}
              accessibilityRole="button"
              accessibilityLabel={`Inspect ${habit.title}, ${label}`}
              style={style}
            >
              {cell.hasNote && <NoteMarker completed={cell.state === 'complete'} />}
              <Text
                maxFontSizeMultiplier={1}
                style={[
                  styles.cellMark,
                  { color: cell.state === 'complete' ? theme.onHabit : theme.muted },
                ]}
              >
                {cell.state === 'complete'
                  ? '✓'
                  : cell.state === 'grace'
                    ? '○'
                    : cell.state === 'not-scheduled'
                      ? '–'
                      : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}
const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    sparkle: { position: 'absolute', right: 66, top: 10, fontSize: 25 },
    card: {
      padding: 12,
      borderRadius: 20,
      gap: 8,
      backgroundColor: theme.surface,
      boxShadow: theme.cardShadow,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    header: { flexDirection: 'row', gap: 10, alignItems: 'center' },
    edit: { flex: 1, flexDirection: 'row', gap: 10, alignItems: 'center', minHeight: 48 },
    titleBlock: { flex: 1 },
    title: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: theme.charcoal },
    support: { fontFamily: 'Inter_400Regular', fontSize: 12, color: theme.muted, marginTop: 3 },
    check: {
      width: 48,
      minHeight: 48,
      borderRadius: 13,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    grid: { flexDirection: 'row', gap: 2, marginLeft: 54, marginRight: 58, marginTop: -4 },
    cell: {
      flex: 1,
      aspectRatio: 1,
      borderRadius: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cellMark: { fontSize: 7 },
    move: { backgroundColor: theme.ivory, borderColor: theme.stone },
    up: { position: 'absolute', left: 0, top: 0 },
    arrow: { color: theme.forest, fontSize: 23 },
  });
