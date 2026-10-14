import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { currentStreak, history, type Completion, type Habit } from '../domain/habit';
import type { LocalDate } from '../domain/calendar';
import { scheduledOn } from '../domain/schedule';
import { habitColors, habitSurfaces, theme } from '../theme/tokens';
import { HabitIcon } from './HabitIcon';
interface Props {
  habit: Habit;
  completions: Completion[];
  today: LocalDate;
  onToggle(): void;
  onView(): void;
  onInspect(day: LocalDate): void;
  ordering?: { first: boolean; last: boolean; move(direction: -1 | 1): void };
}
export function HabitCard({
  habit,
  completions,
  today,
  onToggle,
  onView,
  onInspect,
  ordering,
}: Props) {
  const cells = history(habit, completions, today);
  const due = scheduledOn(habit.schedule, today);
  const done = cells[13]?.state === 'complete';
  const color = habitColors[habit.color];
  const reducedMotion = useReducedMotion();
  const previouslyDone = useRef(done);
  const scale = useSharedValue(1);
  useEffect(() => {
    if (done && !previouslyDone.current && !reducedMotion) {
      scale.value = withSequence(
        withTiming(1.18, { duration: 110 }),
        withTiming(0.94, { duration: 100 }),
        withTiming(1, { duration: 160 }),
      );
    }
    previouslyDone.current = done;
  }, [done, reducedMotion, scale]);
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
          accessibilityLabel={`View ${habit.title}`}
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
              {due ? `${streak} day${streak === 1 ? '' : 's'} in a row` : 'Not scheduled today'}
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
              <Animated.View
                key={done ? 'done' : 'pending'}
                entering={FadeIn.duration(150).reduceMotion(ReduceMotion.System)}
              >
                <Text
                  maxFontSizeMultiplier={1}
                  style={{ color: done ? '#FFFFFF' : color, fontSize: 23 }}
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
      <View style={styles.grid}>
        {cells.map((cell) => {
          const label = `${cell.day}: ${cell.state === 'complete' ? 'completed' : cell.state === 'before-start' || cell.state === 'not-scheduled' ? (cell.state === 'not-scheduled' ? 'not scheduled' : 'before habit started') : cell.today ? 'pending' : 'not completed'}${cell.today ? ', today' : ''}`;
          const style = [
            styles.cell,
            {
              backgroundColor:
                cell.state === 'complete'
                  ? color
                  : cell.state === 'before-start' || cell.state === 'not-scheduled'
                    ? '#F0EEEA'
                    : habitSurfaces[habit.color],
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
              <Text
                maxFontSizeMultiplier={1}
                style={[styles.cellMark, { color: done ? '#FFFFFF' : color }]}
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
              <Text
                maxFontSizeMultiplier={1}
                style={[
                  styles.cellMark,
                  { color: cell.state === 'complete' ? '#FFFFFF' : theme.muted },
                ]}
              >
                {cell.state === 'complete' ? '✓' : cell.state === 'not-scheduled' ? '–' : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 17,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBE8E2',
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
