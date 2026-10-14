import { saveDayNote } from '../../features/habits/notes';
import { usePreferences } from '../../database/provider';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dateKey, type LocalDate } from '../../domain/calendar';
import { calendarCells } from '../../domain/habit';
import { habitMetrics, yearCells } from '../../domain/metrics';
import { plannedDays, scheduleLabel, scheduledOn } from '../../domain/schedule';
import { useHabitData } from '../../features/habits/useHabitData';
import { archiveHabit, editHabit, restoreHabit } from '../../features/habits/service';
import { setDayCompletion } from '../../features/check-ins/service';
import { deviceClock } from '../../lib/clock';
import { HabitIcon } from '../../components/HabitIcon';
import { HabitEditor, type HabitDraft } from '../../components/HabitEditor';
import { StatsGrid } from '../../components/StatsGrid';
import { MonthCalendar } from '../../components/MonthCalendar';
import { YearGrid } from '../../components/YearGrid';
import { DayInspector } from '../../components/DayInspector';
import { theme } from '../../theme/tokens';
function safeDay(value?: string): LocalDate | null {
  try {
    return value ? dateKey(value) : null;
  } catch {
    return null;
  }
}
export default function HabitDetail() {
  const { weekStartsOn } = usePreferences();
  const { id, day, periodStart } = useLocalSearchParams<{
    id: string;
    day?: string;
    periodStart?: string;
  }>();
  const initialDay = safeDay(periodStart) ?? safeDay(day);
  const { repository, refresh, habits, completions, notes, today } = useHabitData();
  const habit = habits.find((value) => value.id === id);
  const [monthIndex, setMonthIndex] = useState(
    Number((initialDay ?? today).slice(0, 4)) * 12 + Number((initialDay ?? today).slice(5, 7)) - 1,
  );
  const [year, setYear] = useState(Number((initialDay ?? today).slice(0, 4)));
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<LocalDate | null>(safeDay(day));
  const [error, setError] = useState('');
  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };
  if (!habit)
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.page}>
          <Text style={styles.heading}>Habit not found</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/')}
            style={styles.action}
          >
            <Text style={styles.link}>Back to Today</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  const metrics = habitMetrics(
    habit,
    completions,
    today,
    dateKey(`${year}-01-01`),
    dateKey(`${year}-12-31`),
  );
  const monthYear = Math.floor(monthIndex / 12);
  const month = (monthIndex % 12) + 1;
  const monthStart = dateKey(`${monthYear}-${String(month).padStart(2, '0')}-01`);
  const monthEnd = dateKey(new Date(Date.UTC(monthYear, month, 0, 12)).toISOString().slice(0, 10));
  const monthCells = calendarCells(habit, completions, monthStart, monthEnd, today, notes);
  const monthLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${monthStart}T12:00:00Z`));
  const cells = yearCells(habit, completions, year, today, notes);
  const selectedCell = selected
    ? calendarCells(habit, completions, selected, selected, today, notes)[0]
    : undefined;
  function save(draft: HabitDraft) {
    editHabit(
      repository,
      id,
      draft.title,
      draft.color,
      draft.icon,
      deviceClock,
      draft.days,
      draft.streakTolerance,
    );
    refresh();
    setEditing(false);
  }
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={back}
            style={styles.action}
          >
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <Text style={styles.eyebrow}>YOUR PROGRESS</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              if (habit.archivedAt) {
                restoreHabit(repository, id, deviceClock);
                refresh();
              } else setEditing(true);
            }}
            style={styles.action}
          >
            <Text style={styles.link}>{habit.archivedAt ? 'Restore habit' : 'Edit habit'}</Text>
          </Pressable>
        </View>
        <View style={styles.identity}>
          <HabitIcon color={habit.color} icon={habit.icon} />
          <View style={{ flex: 1 }}>
            <Text accessibilityRole="header" style={styles.heading}>
              {habit.title}
            </Text>
            <Text style={styles.support}>
              {habit.archivedAt
                ? 'Archived · past wins are saved'
                : scheduleLabel(plannedDays(habit.schedule))}
            </Text>
          </View>
        </View>
        {habit.schedule.at(-1)!.from > today && (
          <Text style={styles.support}>New schedule starts tomorrow.</Text>
        )}
        <View style={styles.yearHeader}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous month"
            disabled={
              monthIndex <=
              Number(habit.startsOn.slice(0, 4)) * 12 + Number(habit.startsOn.slice(5, 7)) - 1
            }
            onPress={() => setMonthIndex(monthIndex - 1)}
            style={styles.action}
          >
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <Text accessibilityRole="header" style={styles.year}>
            {monthLabel}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next month"
            disabled={
              monthIndex >=
              Number((initialDay ?? today).slice(0, 4)) * 12 +
                Number((initialDay ?? today).slice(5, 7)) -
                1
            }
            onPress={() => setMonthIndex(monthIndex + 1)}
            style={styles.action}
          >
            <Text style={styles.back}>›</Text>
          </Pressable>
        </View>
        {!habit.archivedAt && (
          <Pressable
            testID="inspect-today"
            accessibilityRole="button"
            onPress={() => setSelected(today)}
            style={styles.action}
          >
            <Text style={styles.link}>Add a note for today</Text>
          </Pressable>
        )}
        <MonthCalendar
          weekStartsOn={weekStartsOn}
          cells={monthCells}
          color={habit.color}
          onInspect={setSelected}
        />
        <StatsGrid
          items={[
            { icon: '🌱', value: metrics.currentStreak, label: 'Current streak' },
            { icon: '🏆', value: metrics.bestStreak, label: `Best streak · ${year}` },
            {
              icon: '◎',
              value: metrics.consistency === null ? '—' : `${metrics.consistency}%`,
              label: `Consistency · ${year}`,
            },
            { icon: '✓', value: metrics.totalWins, label: `Total wins · ${year}` },
          ]}
        />
        <View style={styles.yearHeader}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous year"
            disabled={year <= Number(habit.startsOn.slice(0, 4))}
            onPress={() => setYear(year - 1)}
            style={styles.action}
          >
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <Text accessibilityRole="header" style={styles.year}>
            {year}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next year"
            disabled={year >= Number(today.slice(0, 4))}
            onPress={() => setYear(year + 1)}
            style={styles.action}
          >
            <Text style={styles.back}>›</Text>
          </Pressable>
        </View>
        <Text style={styles.support}>
          Each square is one day. Tap a past day to inspect it; changes require a separate
          confirmation below.
        </Text>
        <YearGrid
          weekStartsOn={weekStartsOn}
          cells={cells}
          color={habit.color}
          onInspect={setSelected}
        />
        <Text style={styles.support}>
          Colored ✓ completed · soft ○ within tolerance · pale missed · dashed – not scheduled ·
          blank before start or future. Corner mark: has note. Today is outlined.
        </Text>
        <Text style={styles.support}>
          Consistency includes scheduled dates through today. Days before creation, future days and
          rest days are excluded.
        </Text>
        {!!error && (
          <Text accessibilityRole="alert" style={styles.support}>
            {error}
          </Text>
        )}
        <Text style={styles.footer}>Progress happens one small step at a time.</Text>
      </ScrollView>
      {editing && (
        <HabitEditor
          habit={habit}
          onSave={save}
          onClose={() => setEditing(false)}
          onArchive={() => {
            try {
              archiveHabit(repository, deviceClock, id);
              refresh();
              setEditing(false);
            } catch {
              setError('Could not archive this habit. Please try again.');
            }
          }}
        />
      )}
      {selectedCell && (
        <DayInspector
          key={selectedCell.day}
          cell={selectedCell}
          habitTitle={habit.title}
          note={
            notes.find((note) => note.habitId === id && note.localDate === selectedCell.day)
              ?.text ?? ''
          }
          noteEditable={
            !habit.archivedAt && selectedCell.day >= habit.startsOn && selectedCell.day <= today
          }
          onSaveNote={(text) => {
            saveDayNote(repository, deviceClock, id, selectedCell.day, text);
            refresh();
          }}
          editable={
            !habit.archivedAt &&
            selectedCell.day >= habit.startsOn &&
            selectedCell.day <= today &&
            (scheduledOn(habit.schedule, selectedCell.day) || selectedCell.state === 'complete')
          }
          onChange={(completed) => {
            setDayCompletion(repository, deviceClock, id, selectedCell.day, completed);
            refresh();
          }}
          onClose={() => setSelected(null)}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.ivory },
  page: {
    padding: 16,
    gap: 16,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingBottom: 32,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  action: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  back: { fontSize: 30, color: theme.forest },
  eyebrow: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.3,
    color: theme.muted,
  },
  link: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: theme.forest },
  identity: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  heading: { fontFamily: 'Fraunces_600SemiBold', fontSize: 29, color: theme.forest },
  support: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, color: theme.muted },
  yearHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  year: { fontFamily: 'Fraunces_600SemiBold', fontSize: 25, color: theme.forest },
  footer: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 21,
    color: theme.forest,
    textAlign: 'center',
    padding: 16,
  },
});
