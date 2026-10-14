import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme, useThemeStyles } from '../theme/useTheme';
import type { ThemePalette } from '../theme/tokens';

export function DailyProgress({ wins, planned }: { wins: number; planned: number }) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles, theme);
  const complete = planned > 0 && wins === planned;
  const previous = useRef(complete);
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const progress = useSharedValue(planned ? wins / planned : 0);
  useEffect(() => {
    const target = planned ? wins / planned : 0;
    progress.value = reducedMotion ? target : withTiming(target, { duration: 260 });
    if (complete && !previous.current && !reducedMotion) {
      scale.value = withSequence(
        withTiming(1.22, { duration: 180 }),
        withTiming(0.96, { duration: 130 }),
        withTiming(1, { duration: 170 }),
      );
    }
    previous.current = complete;
  }, [wins, planned, complete, reducedMotion, progress, scale]);
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));
  return (
    <View testID="daily-progress" style={[styles.banner, complete && styles.complete]}>
      <Animated.View accessible={false} style={iconStyle}>
        <Text accessible={false} maxFontSizeMultiplier={1} style={styles.icon}>
          {complete ? '✨' : planned ? '🌱' : '🌿'}
        </Text>
      </Animated.View>
      <View style={styles.body} accessibilityLiveRegion="polite">
        <Text style={styles.heading}>
          {complete
            ? 'All done for today!\nEnjoy your little win.'
            : planned
              ? 'Small wins today,\nbrighter tomorrows.'
              : 'A little room to breathe.'}
        </Text>
        <Text style={styles.copy}>
          {complete
            ? `${wins} of ${planned} planned wins`
            : planned
              ? `${wins} of ${planned} planned wins`
              : 'Nothing planned today. Make the day yours.'}
        </Text>
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
    banner: {
      padding: 14,
      borderRadius: 17,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
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
