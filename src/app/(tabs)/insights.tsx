import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePreferences } from '../../database/provider';
import type { LocalDate } from '../../domain/calendar';
import { calendarCells } from '../../domain/habit';
import {
  reportPeriods,
  reportRange,
  shiftReport,
  victoryReport,
  type ReportPeriod,
} from '../../domain/report';
import { useHabitData } from '../../features/habits/useHabitData';
import { setDayCompletion } from '../../features/check-ins/service';
import { deviceClock } from '../../lib/clock';
import { VictoryWall } from '../../components/VictoryWall';
import { DayInspector } from '../../components/DayInspector';
import { StatsGrid } from '../../components/StatsGrid';
import { theme } from '../../theme/tokens';
export default function Insights() {
  const { repository, refresh, habits, completions, today } = useHabitData();
  const { weekStartsOn } = usePreferences();
  const [period, setPeriod] = useState<ReportPeriod>('year');
  const [anchor, setAnchor] = useState(today);
  const [selected, setSelected] = useState<{ id: string; day: LocalDate } | null>(null);
  const [notice, setNotice] = useState('');
  const range = reportRange(period, anchor, weekStartsOn);
  const current = reportRange(period, today, weekStartsOn);
  const result = victoryReport(habits, completions, today, range);
  const earliest = habits.reduce(
    (first, habit) => (habit.startsOn < first ? habit.startsOn : first),
    today,
  );
  const firstRange = reportRange(period, earliest, weekStartsOn);
  const selectedHabit = habits.find((habit) => habit.id === selected?.id);
  const cell =
    selectedHabit && selected
      ? calendarCells(selectedHabit, completions, selected.day, selected.day, today)[0]
      : null;
  const editable =
    !!selectedHabit &&
    !selectedHabit.archivedAt &&
    !!cell &&
    (cell.state === 'complete' || cell.state === 'missed' || cell.state === 'grace');
  const format = (day: LocalDate, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(
      new Date(`${day}T12:00:00Z`),
    );
  const label =
    period === 'year'
      ? range.start.slice(0, 4)
      : period === 'month'
        ? format(range.start, { month: 'long', year: 'numeric' })
        : `${format(range.start, { month: 'short', day: 'numeric' })} – ${format(range.end, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  function changePeriod(value: ReportPeriod) {
    setPeriod(value);
    setAnchor((value) => (value < earliest ? earliest : value > today ? today : value));
    setNotice('');
  }
  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={result.items}
        keyExtractor={(item) => item.habit.id}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        contentContainerStyle={styles.page}
        ListHeaderComponent={
          <View style={styles.intro}>
            <Text accessibilityRole="header" style={styles.heading}>
              Insights
            </Text>
            <Text style={styles.support}>
              One tile, one tiny win. Look at what you’re building.
            </Text>
            <View
              accessibilityRole="radiogroup"
              accessibilityLabel="Report period"
              style={styles.periods}
            >
              {reportPeriods.map((value) => (
                <Pressable
                  key={value}
                  accessibilityRole="radio"
                  accessibilityLabel={value[0]!.toUpperCase() + value.slice(1)}
                  accessibilityState={{ checked: period === value }}
                  aria-checked={period === value}
                  onPress={() => changePeriod(value)}
                  style={[styles.period, period === value && styles.chosen]}
                >
                  <Text style={[styles.link, period === value && { color: '#FFFFFF' }]}>
                    {value[0]!.toUpperCase() + value.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.navigation}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Previous report period"
                accessibilityState={{ disabled: range.start <= firstRange.start }}
                disabled={range.start <= firstRange.start}
                onPress={() => {
                  setAnchor(shiftReport(period, range.start, -1));
                  setNotice('');
                }}
                style={[styles.arrow, range.start <= firstRange.start && styles.disabled]}
              >
                <Text style={styles.chevron}>‹</Text>
              </Pressable>
              <Text accessibilityRole="header" style={styles.range}>
                {label}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Return report to today"
                onPress={() => {
                  setAnchor(today);
                  setNotice('');
                }}
                style={styles.today}
              >
                <Text style={styles.link}>Today</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Next report period"
                accessibilityState={{ disabled: range.start >= current.start }}
                disabled={range.start >= current.start}
                onPress={() => {
                  setAnchor(shiftReport(period, range.start, 1));
                  setNotice('');
                }}
                style={[styles.arrow, range.start >= current.start && styles.disabled]}
              >
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            </View>
            <Text accessibilityLiveRegion="polite" style={styles.support}>
              {notice ||
                'Tap a tile to inspect its date. Marking or undoing a win needs a separate confirmation.'}
            </Text>
            <Text style={styles.legend}>
              ✓ Win · soft ○ Within tolerance · • Pending / missed · – Rest{'\n'}Empty outline:
              before start · Dashed outline: future
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <VictoryWall
            habit={item.habit}
            cells={item.cells}
            period={period}
            weekStartsOn={weekStartsOn}
            wins={item.metrics.totalWins}
            eligibleWins={item.metrics.eligibleWins}
            eligibleDays={item.metrics.eligibleDays}
            onInspect={(day) => setSelected({ id: item.habit.id, day })}
            onView={() =>
              router.push({
                pathname: '/habit/[id]',
                params: {
                  id: item.habit.id,
                  periodStart:
                    range.start < item.habit.startsOn && range.end >= item.habit.startsOn
                      ? item.habit.startsOn
                      : range.start,
                },
              })
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.section}>Your first win starts something.</Text>
            <Text style={styles.support}>Create a habit in Today to begin filling your wall.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace('/')}
              style={styles.today}
            >
              <Text style={styles.link}>Go to Today →</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          <View style={styles.summary}>
            <Text accessibilityRole="header" style={styles.section}>
              This {period}, together
            </Text>
            <StatsGrid
              items={[
                { icon: '✓', value: result.totalWins, label: `Wins this ${period}` },
                {
                  icon: '◎',
                  value: result.consistency === null ? '—' : `${result.consistency}%`,
                  label: 'Consistency · planned days',
                },
              ]}
            />
            <Text style={styles.support}>
              Consistency counts scheduled dates through today. Future days, rest days and dates
              before creation don’t count. Archived histories stay visible.
            </Text>
            <Text style={styles.footer}>A missed day never erases your wins.</Text>
          </View>
        }
      />
      {cell && selectedHabit && selected && (
        <DayInspector
          key={`${selected.id}:${selected.day}`}
          habitTitle={selectedHabit.title}
          cell={cell}
          editable={editable}
          onClose={() => setSelected(null)}
          onChange={(completed) => {
            setDayCompletion(repository, deviceClock, selectedHabit.id, selected.day, completed);
            refresh();
            setNotice(
              completed
                ? `${selectedHabit.title}: one more tile filled. ✓`
                : `${selectedHabit.title}: win undone.`,
            );
            setSelected(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.ivory },
  page: { padding: 16, paddingBottom: 32, width: '100%', maxWidth: 600, alignSelf: 'center' },
  intro: { gap: 14, marginBottom: 16 },
  heading: { fontFamily: 'Fraunces_600SemiBold', fontSize: 34, color: theme.forest, marginTop: 16 },
  support: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, color: theme.muted },
  periods: { flexDirection: 'row', gap: 8 },
  period: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: theme.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chosen: { backgroundColor: theme.forest },
  navigation: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  arrow: {
    width: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  chevron: { fontSize: 28, color: theme.forest },
  range: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: theme.forest,
    textAlign: 'center',
  },
  today: {
    minHeight: 48,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  link: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: theme.forest },
  disabled: { opacity: 0.35 },
  legend: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 18, color: theme.muted },
  summary: { gap: 14, marginTop: 20 },
  section: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: theme.forest },
  empty: { gap: 12, padding: 16 },
  footer: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 20,
    color: theme.muted,
    textAlign: 'center',
    marginTop: 12,
  },
});
