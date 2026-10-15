import { useI18n } from '../features/localization/provider';
import { BotanicalMark } from './BotanicalMark';
import { useCelebrations } from '../features/feedback/provider';
import { CozyIllustration } from './CozyIllustration';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme, useThemeStyles } from '../theme/useTheme';
import type { ThemePalette } from '../theme/tokens';

export function DailyProgress({
  wins,
  planned,
  hasWeeklyGoals = false,
}: {
  wins: number;
  planned: number;
  hasWeeklyGoals?: boolean;
}) {
  const { t, progress: progressLabel } = useI18n();
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles, theme);
  const complete = planned > 0 && wins === planned;
  const { event, animationsAllowed } = useCelebrations();
  const lastEvent = useRef(event?.serial ?? 0);
  const scale = useSharedValue(1);
  const sparkle = useSharedValue(0);
  const progress = useSharedValue(planned ? wins / planned : 0);
  useEffect(() => {
    const fresh = !!event && event.serial !== lastEvent.current;
    if (event) lastEvent.current = event.serial;
    const target = planned ? wins / planned : 0;
    progress.value = animationsAllowed && fresh ? withTiming(target, { duration: 300 }) : target;
    if (complete && fresh && animationsAllowed && event.kind === 'all-day') {
      sparkle.value = withSequence(
        withTiming(1, { duration: 180 }),
        withTiming(0, { duration: 1000 }),
      );
      scale.value = withSequence(
        withTiming(1.1, { duration: 180 }),
        withTiming(0.98, { duration: 140 }),
        withTiming(1, { duration: 200 }),
      );
    }
    if (!animationsAllowed || !event) {
      scale.value = 1;
      sparkle.value = 0;
    }
  }, [wins, planned, complete, event, animationsAllowed, progress, scale, sparkle]);
  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkle.value,
    transform: [{ translateY: -8 * (1 - sparkle.value) }],
  }));
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));
  return (
    <View testID="daily-progress" style={[styles.banner, complete && styles.complete]}>
      <Animated.Text
        testID="day-sparkles"
        accessible={false}
        aria-hidden={true}
        pointerEvents="none"
        maxFontSizeMultiplier={1}
        style={[styles.sparkle, sparkleStyle]}
      >
        ✦ ✧
      </Animated.Text>
      <Animated.View accessible={false} style={iconStyle}>
        {complete ? <CozyIllustration width={76} /> : <BotanicalMark />}
      </Animated.View>
      <View style={styles.body} accessibilityLiveRegion="polite">
        <Text style={styles.heading}>
          {complete
            ? t('All done for today!\nYou grew a little.')
            : planned
              ? t('Small wins today,\nbrighter tomorrows.')
              : hasWeeklyGoals
                ? t('Your week, your rhythm.')
                : t('A little room to breathe.')}
        </Text>
        <Text style={styles.copy}>
          {complete
            ? progressLabel(wins, planned)
            : planned
              ? progressLabel(wins, planned)
              : hasWeeklyGoals
                ? t('Choose the days for your weekly wins.')
                : t('Nothing planned today. Make the day yours.')}
        </Text>
        {hasWeeklyGoals && planned > 0 && (
          <Text style={styles.copy}>{t('Weekly goals follow your rhythm.')}</Text>
        )}
        {planned > 0 && (
          <View accessible={false} style={styles.track}>
            <Animated.View style={[styles.fill, progressStyle]} />
          </View>
        )}
      </View>
    </View>
  );
}
const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    sparkle: { position: 'absolute', left: 24, top: 6, fontSize: 16, color: theme.forest },
    banner: {
      padding: 16,
      borderRadius: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: theme.progress,
      marginBottom: 4,
      minHeight: 106,
    },
    complete: { backgroundColor: theme.celebration },
    icon: { fontSize: 35 },
    body: { flex: 1 },
    heading: {
      fontFamily: 'Fraunces_600SemiBold',
      color: theme.forest,
      fontSize: 19,
      lineHeight: 25,
      minHeight: 50,
    },
    copy: { fontFamily: 'Inter_400Regular', fontSize: 12, color: theme.muted, lineHeight: 19 },
    track: {
      height: 4,
      marginTop: 8,
      borderRadius: 2,
      backgroundColor: theme.track,
      overflow: 'hidden',
    },
    fill: { height: '100%', backgroundColor: theme.forest, borderRadius: 2 },
  });
