import { Text, View } from 'react-native';
import type { WeeklyPeriod } from '../domain/weekly';
import { useI18n } from '../features/localization/provider';
import { useTheme } from '../theme/useTheme';

export function WeeklyGoalProgress({ week }: { week: WeeklyPeriod | null }) {
  const { t, date, weeklyProgress, shortWeekLabel } = useI18n();
  const { theme } = useTheme();
  if (!week) return null;
  return (
    <View
      testID="weekly-goal-progress"
      accessibilityLiveRegion="polite"
      style={{ gap: 6, paddingVertical: 10 }}
    >
      <Text style={{ fontFamily: 'Inter_600SemiBold', color: theme.forest, fontSize: 15 }}>
        {weeklyProgress(week.wins, week.target)}
        {week.achieved ? ` · ${t('Weekly goal met ✓')}` : ''}
      </Text>
      <Text style={{ fontFamily: 'Inter_400Regular', color: theme.muted, fontSize: 13 }}>
        {date(week.start, { month: 'short', day: 'numeric' })} →{' '}
        {date(week.end, { month: 'short', day: 'numeric' })}
      </Text>
      {week.target < week.goal && (
        <Text style={{ fontFamily: 'Inter_400Regular', color: theme.muted, fontSize: 13 }}>
          {shortWeekLabel(week.target)}
        </Text>
      )}
    </View>
  );
}
