import { useI18n, useMessage } from '../../features/localization/provider';
import { useCelebrations } from '../../features/feedback/provider';
import { CozyNote } from '../../components/CozyNote';
import { usePreferences } from '../../database/provider';
import type { WeekStartsOn } from '../../domain/preferences';
import { router } from 'expo-router';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deviceClock } from '../../lib/clock';
import { BackupControls } from '../../components/BackupControls';
import { useTheme, useThemeStyles } from '../../theme/useTheme';
import { darkPalette, type ThemePalette } from '../../theme/tokens';
export default function Settings() {
  const { setAnimations, animationsAllowed } = useCelebrations();
  const { t } = useI18n();
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles, theme);
  const {
    weekStartsOn,
    setWeekStartsOn,
    appearance,
    setAppearance,
    celebrationAnimations,
    language,
    setLanguage,
  } = usePreferences();
  const [error, setError] = useMessage();
  function changeWeek(value: WeekStartsOn) {
    try {
      setWeekStartsOn(value);
      setError('');
    } catch {
      setError('We couldn’t save your preference. Please try again.');
    }
  }
  return (
    <SafeAreaView
      testID={theme === darkPalette.theme ? 'settings-theme-dark' : 'settings-theme-light'}
      style={styles.safe}
    >
      <ScrollView contentContainerStyle={styles.page}>
        <Text accessibilityRole="header" style={styles.heading}>
          {t('Settings')}
        </Text>
        <View style={styles.card}>
          <Text style={styles.title}>{t('Your habits stay with you')}</Text>
          <Text style={styles.copy}>
            {Platform.OS === 'web'
              ? t(
                  'This preview stores your wins in this browser. Keep one Tiny Wins tab open at a time.',
                )
              : t('Your habits and wins are stored on this device.')}
          </Text>
          <Text style={styles.copy}>
            {t(
              'Tiny Wins does not send your habit data to a server. Use a backup file when moving devices.',
            )}
          </Text>
        </View>
        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.title}>
            {t('Language')}
          </Text>
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel={t('Interface language')}
            style={styles.appearanceChoices}
          >
            {(['system', 'en', 'pt-BR'] as const).map((value) => {
              const name =
                value === 'system'
                  ? t('System')
                  : value === 'en'
                    ? 'English'
                    : 'Português (Brasil)';
              return (
                <Pressable
                  key={value}
                  testID={`language-${value}`}
                  accessibilityRole="radio"
                  accessibilityLabel={
                    language === value ? t('{language}, selected', { language: name }) : name
                  }
                  accessibilityState={{ checked: language === value }}
                  aria-checked={language === value}
                  onPress={() => {
                    try {
                      setLanguage(value);
                      setError('');
                    } catch {
                      setError('We couldn’t save your preference. Please try again.');
                    }
                  }}
                  style={[styles.choice, language === value && styles.chosen]}
                >
                  <Text
                    style={[styles.choiceText, language === value && { color: theme.onPrimary }]}
                  >
                    {language === value ? '✓ ' : ''}
                    {name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.copy}>
            {t(
              'System follows your device language. Habit names and notes stay as you wrote them.',
            )}
          </Text>
          {!!error && (
            <Text accessibilityRole="alert" style={styles.copy}>
              {error}
            </Text>
          )}
        </View>
        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.title}>
            {t('Make the calendar yours')}
          </Text>
          <Text style={styles.copy}>{t('Start your week on')}</Text>
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel={t('First day of the week')}
            style={styles.choices}
          >
            {([1, 0] as const).map((value) => (
              <Pressable
                key={value}
                accessibilityRole="radio"
                accessibilityLabel={value === 1 ? t('Monday') : t('Sunday')}
                accessibilityState={{ checked: weekStartsOn === value }}
                aria-checked={weekStartsOn === value}
                onPress={() => changeWeek(value)}
                style={[styles.choice, weekStartsOn === value && styles.chosen]}
              >
                <Text
                  style={[styles.choiceText, weekStartsOn === value && { color: theme.onPrimary }]}
                >
                  {weekStartsOn === value ? '✓ ' : ''}
                  {value === 1 ? t('Monday') : t('Sunday')}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.copy}>
            {t(
              'Saved on this device. Changes the monthly and yearly calendar layout. Your schedules and past wins stay the same.',
            )}
          </Text>
          {!!error && (
            <Text accessibilityRole="alert" style={styles.copy}>
              {error}
            </Text>
          )}
        </View>
        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.title}>
            {t('Make yourself comfortable')}
          </Text>
          <Text style={styles.copy}>{t('Appearance')}</Text>
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel={t('Appearance')}
            style={styles.appearanceChoices}
          >
            {(['system', 'light', 'dark'] as const).map((value) => (
              <Pressable
                key={value}
                testID={`appearance-${value}`}
                accessibilityRole="radio"
                accessibilityLabel={t(
                  appearance === value
                    ? '{appearance} appearance, selected'
                    : '{appearance} appearance',
                  {
                    appearance: t(
                      value === 'system' ? 'System' : value === 'light' ? 'Light' : 'Dark',
                    ),
                  },
                )}
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
                  {t(value === 'system' ? 'System' : value === 'light' ? 'Light' : 'Dark')}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.copy}>
            {t(
              'System follows your device. Your choice is saved here; your wins and notes stay the same.',
            )}
          </Text>
          {!!error && (
            <Text accessibilityRole="alert" style={styles.copy}>
              {error}
            </Text>
          )}
        </View>
        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.title}>
            {t('Celebrate your little wins')}
          </Text>
          <View style={styles.feedbackChoice}>
            <Text style={[styles.copy, { flex: 1 }]}>{t('Celebration animations')}</Text>
            <Switch
              testID="celebration-animations"
              hitSlop={12}
              accessibilityLabel={t(
                celebrationAnimations
                  ? 'Celebration animations, on'
                  : 'Celebration animations, off',
              )}
              value={celebrationAnimations}
              onValueChange={(value) => {
                try {
                  setAnimations(value);
                  setError('');
                } catch {
                  setError('We couldn’t save your preference. Please try again.');
                }
              }}
              trackColor={{ false: theme.stone, true: theme.forest }}
              thumbColor={theme.surface}
            />
          </View>
          <Text style={styles.copy}>
            {t(
              'Gentle feedback for a win, and a little extra warmth when your day is complete. System reduced motion always takes priority.',
            )}
          </Text>
          {celebrationAnimations && !animationsAllowed && (
            <Text style={styles.copy}>
              {t('Your device requests reduced motion, so wins stay quietly celebrated.')}
            </Text>
          )}
          {!!error && (
            <Text accessibilityRole="alert" style={styles.copy}>
              {error}
            </Text>
          )}
        </View>
        <BackupControls />
        <View style={styles.card}>
          <Text style={styles.title}>{t('Your local calendar')}</Text>
          <Text style={styles.copy}>{deviceClock.timezone()}</Text>
          <Text style={styles.copy}>
            {t(
              'A win belongs to the calendar date you completed it on. Travel does not move your past wins.',
            )}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push({ pathname: '/', params: { archived: '1' } })}
          style={styles.card}
        >
          <Text style={styles.title}>{t('Archived habits →')}</Text>
          <Text style={styles.copy}>{t('Take a break and come back when you’re ready.')}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="link"
          onPress={() => void Linking.openURL('https://github.com/squiter/tiny-wins')}
          style={styles.card}
        >
          <Text style={styles.title}>{t('View the project on GitHub ↗')}</Text>
          <Text style={styles.copy}>Tiny Wins · 0.1.0</Text>
        </Pressable>
        <CozyNote message={t('Small steps. Big changes.')} />
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
      borderRadius: 20,
      backgroundColor: theme.surface,
      boxShadow: theme.cardShadow,
      borderWidth: 1,
      borderColor: theme.stone,
      minHeight: 48,
    },
    choices: { flexDirection: 'row', gap: 10 },
    appearanceChoices: { gap: 8 },
    feedbackChoice: { flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: 48 },
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
