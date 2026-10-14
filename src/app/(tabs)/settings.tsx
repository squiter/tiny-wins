import { useState } from 'react';
import { usePreferences } from '../../database/provider';
import type { WeekStartsOn } from '../../domain/preferences';
import { router } from 'expo-router';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deviceClock } from '../../lib/clock';
import { BackupControls } from '../../components/BackupControls';
import { useTheme, useThemeStyles } from '../../theme/useTheme';
import type { ThemePalette } from '../../theme/tokens';
export default function Settings() {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles, theme);
  const { weekStartsOn, setWeekStartsOn, appearance, setAppearance } = usePreferences();
  const [error, setError] = useState('');
  function changeWeek(value: WeekStartsOn) {
    try {
      setWeekStartsOn(value);
      setError('');
    } catch {
      setError('We couldn’t save your preference. Please try again.');
    }
  }
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text accessibilityRole="header" style={styles.heading}>
          Settings
        </Text>
        <View style={styles.card}>
          <Text style={styles.title}>Your habits stay with you</Text>
          <Text style={styles.copy}>
            {Platform.OS === 'web'
              ? 'This preview stores your wins in this browser. Keep one Tiny Wins tab open at a time.'
              : 'Your habits and wins are stored on this device.'}
          </Text>
          <Text style={styles.copy}>
            Tiny Wins does not send your habit data to a server. Use a backup file when moving
            devices.
          </Text>
        </View>
        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.title}>
            Make the calendar yours
          </Text>
          <Text style={styles.copy}>Start your week on</Text>
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel="First day of the week"
            style={styles.choices}
          >
            {([1, 0] as const).map((value) => (
              <Pressable
                key={value}
                accessibilityRole="radio"
                accessibilityLabel={value === 1 ? 'Monday' : 'Sunday'}
                accessibilityState={{ checked: weekStartsOn === value }}
                aria-checked={weekStartsOn === value}
                onPress={() => changeWeek(value)}
                style={[styles.choice, weekStartsOn === value && styles.chosen]}
              >
                <Text
                  style={[styles.choiceText, weekStartsOn === value && { color: theme.onPrimary }]}
                >
                  {weekStartsOn === value ? '✓ ' : ''}
                  {value === 1 ? 'Monday' : 'Sunday'}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.copy}>
            Saved on this device. Changes the monthly and yearly calendar layout. Your schedules and
            past wins stay the same.
          </Text>
          {!!error && (
            <Text accessibilityRole="alert" style={styles.copy}>
              {error}
            </Text>
          )}
        </View>
        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.title}>
            Make yourself comfortable
          </Text>
          <Text style={styles.copy}>Appearance</Text>
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel="Appearance"
            style={styles.appearanceChoices}
          >
            {(['system', 'light', 'dark'] as const).map((value) => (
              <Pressable
                key={value}
                testID={`appearance-${value}`}
                accessibilityRole="radio"
                accessibilityLabel={`${value[0]!.toUpperCase()}${value.slice(1)} appearance${appearance === value ? ', selected' : ''}`}
                accessibilityState={{ checked: appearance === value }}
                aria-checked={appearance === value}
                onPress={() => {
                  try {
                    setAppearance(value);
                    setError('');
                  } catch {
                    setError('We couldn’t save your preference. Please try again.');
                  }
                }}
                style={[styles.choice, appearance === value && styles.chosen]}
              >
                <Text
                  style={[styles.choiceText, appearance === value && { color: theme.onPrimary }]}
                >
                  {appearance === value ? '✓ ' : ''}
                  {value[0]!.toUpperCase()}
                  {value.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.copy}>
            System follows your device. Your choice is saved here; your wins and notes stay the
            same.
          </Text>
          {!!error && (
            <Text accessibilityRole="alert" style={styles.copy}>
              {error}
            </Text>
          )}
        </View>
        <BackupControls />
        <View style={styles.card}>
          <Text style={styles.title}>Your local calendar</Text>
          <Text style={styles.copy}>{deviceClock.timezone()}</Text>
          <Text style={styles.copy}>
            A win belongs to the calendar date you completed it on. Travel does not move your past
            wins.
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push({ pathname: '/', params: { archived: '1' } })}
          style={styles.card}
        >
          <Text style={styles.title}>Archived habits →</Text>
          <Text style={styles.copy}>Take a break and come back when you’re ready.</Text>
        </Pressable>
        <Pressable
          accessibilityRole="link"
          onPress={() => void Linking.openURL('https://github.com/squiter/tiny-wins')}
          style={styles.card}
        >
          <Text style={styles.title}>View the project on GitHub ↗</Text>
          <Text style={styles.copy}>Tiny Wins · 0.1.0</Text>
        </Pressable>
        <Text style={styles.footer}>Small steps. Big changes.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.ivory },
    page: { padding: 16, gap: 16, width: '100%', maxWidth: 600, alignSelf: 'center' },
    heading: {
      fontFamily: 'Fraunces_600SemiBold',
      fontSize: 34,
      color: theme.forest,
      marginTop: 16,
    },
    card: {
      padding: 18,
      gap: 10,
      borderRadius: 16,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.stone,
      minHeight: 48,
    },
    choices: { flexDirection: 'row', gap: 10 },
    appearanceChoices: { gap: 8 },
    choice: {
      flex: 1,
      minHeight: 48,
      padding: 12,
      borderRadius: 12,
      backgroundColor: theme.ivory,
      borderWidth: 1,
      borderColor: theme.stone,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chosen: { backgroundColor: theme.forest, borderColor: theme.forest },
    choiceText: { fontFamily: 'Inter_600SemiBold', color: theme.forest, fontSize: 14 },
    title: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: theme.forest },
    copy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: theme.muted },
    footer: {
      fontFamily: 'Fraunces_600SemiBold',
      fontSize: 21,
      color: theme.forest,
      textAlign: 'center',
      marginVertical: 20,
    },
  });
