import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, LinearTransition, ReduceMotion } from 'react-native-reanimated';
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
          onPress={onView}
          style={styles.edit}
        >
          <HabitIcon icon={habit.icon} color={habit.color} />
          <View style={styles.titleBlock}>
            <Text numberOfLines={2} style={styles.title}>
              {habit.title}
            </Text>
            <Text style={styles.support}>
              {due ? `${streak} day${streak === 1 ? '' : 's'} in a row` : 'Not scheduled today'}
            </Text>
          </View>
        </Pressable>
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
      {ordering && (
        <View style={styles.order}>
          {([-1, 1] as const).map((direction) => {
            const disabled = direction === -1 ? ordering.first : ordering.last;
            return (
              <Pressable
                key={direction}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={`Move ${habit.title} ${direction === -1 ? 'up' : 'down'}`}
                accessibilityState={{ disabled }}
                onPress={() => ordering.move(direction)}
                style={[styles.orderButton, disabled && { opacity: 0.35 }]}
              >
                <Text style={styles.orderText}>
                  {direction === -1 ? '↑ Move up' : '↓ Move down'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
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
  order: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  orderButton: {
    paddingHorizontal: 12,
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: theme.ivory,
  },
  orderText: { color: theme.forest, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
});
