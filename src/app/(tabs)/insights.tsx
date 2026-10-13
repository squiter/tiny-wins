import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { insights } from '../../domain/metrics';
import { useHabitData } from '../../features/habits/useHabitData';
import { StatsGrid } from '../../components/StatsGrid';
import { HabitIcon } from '../../components/HabitIcon';
import { theme } from '../../theme/tokens';
export default function Insights() {
  const { habits, completions, today } = useHabitData();
  const result = insights(habits, completions, today);
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text accessibilityRole="header" style={styles.heading}>
          Insights
        </Text>
        <Text style={styles.support}>A little perspective on your progress.</Text>
        <StatsGrid
          items={[
            { icon: '🌱', value: result.bestCurrentStreak, label: 'Longest current streak' },
            {
              icon: '◎',
              value: result.consistency === null ? '—' : `${result.consistency}%`,
              label: 'Consistency · past 30 days',
            },
            { icon: '↗', value: result.activeHabits, label: 'Active habits' },
            { icon: '✓', value: result.totalWins, label: 'All-time wins' },
          ]}
        />
        <Text style={styles.support}>
          Consistency reflects scheduled opportunities across active habits, including today. Your
          archived wins remain in the all-time total.
        </Text>
        <Text accessibilityRole="header" style={styles.section}>
          Your habits · past 30 days
        </Text>
        {result.items.map(({ habit, metrics }) => (
          <Pressable
            key={habit.id}
            accessibilityRole="button"
            accessibilityLabel={`View ${habit.title} progress`}
            onPress={() => router.push({ pathname: '/habit/[id]', params: { id: habit.id } })}
            style={styles.row}
          >
            <HabitIcon icon={habit.icon} color={habit.color} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{habit.title}</Text>
              <Text style={styles.support}>
                {metrics.eligibleWins} of {metrics.eligibleDays} planned wins
              </Text>
            </View>
            <Text style={styles.rate}>
              {metrics.consistency === null ? '—' : `${metrics.consistency}%`} ›
            </Text>
          </Pressable>
        ))}
        {!result.items.length && (
          <View style={styles.empty}>
            <Text style={styles.section}>Your first win starts something.</Text>
            <Text style={styles.support}>Create a habit in Today to see your progress here.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace('/')}
              style={styles.row}
            >
              <Text style={styles.name}>Go to Today →</Text>
            </Pressable>
          </View>
        )}
        <Text style={styles.footer}>Consistency over perfection.</Text>
      </ScrollView>
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
  heading: { fontFamily: 'Fraunces_600SemiBold', fontSize: 34, color: theme.forest, marginTop: 16 },
  support: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, color: theme.muted },
  section: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: theme.forest },
  row: {
    padding: 14,
    minHeight: 64,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: theme.stone,
  },
  name: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: theme.charcoal },
  rate: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: theme.forest },
  empty: { gap: 12 },
  footer: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 20,
    color: theme.muted,
    textAlign: 'center',
    marginTop: 12,
  },
});
