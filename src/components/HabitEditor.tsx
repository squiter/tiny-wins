import { useI18n, useMessage } from '../features/localization/provider';
import { useState } from 'react';
import type { LocalDate } from '../domain/calendar';
import { usePreferences } from '../database/provider';
import { starterIdeas, starterIdeaFields } from '../features/habits/starterIdeas';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  colorKeys,
  habitTitle,
  iconKeys,
  type ColorKey,
  type Habit,
  type IconKey,
} from '../domain/habit';
import {
  versionOn,
  plannedVersion,
  type WeeklyGoal,
  allWeekdays,
  plannedDays,
  plannedTolerance,
  validateWeekdays,
  type Weekday,
} from '../domain/schedule';
import { useTheme, useThemeStyles } from '../theme/useTheme';
import type { ThemePalette } from '../theme/tokens';
import { habitIcons, HabitIcon } from './HabitIcon';
export interface HabitDraft {
  title: string;
  color: ColorKey;
  icon: IconKey;
  days: Weekday[];
  streakTolerance: number;
  weekly: WeeklyGoal | null;
}
interface Props {
  today: LocalDate;
  habit: Habit | null;
  onSave(draft: HabitDraft): void;
  onClose(): void;
  onArchive(): void;
}
export function HabitEditor({ habit, today, onSave, onClose, onArchive }: Props) {
  const { t, count, number, weekdayChoice, language, weekdays, weeklyGoalName } = useI18n();
  const { weekStartsOn } = usePreferences();
  const [weekly, setWeekly] = useState<WeeklyGoal | null>(
    habit ? (plannedVersion(habit.schedule).weekly ?? null) : null,
  );
  const weeklyBoundary =
    (habit
      ? (plannedVersion(habit.schedule).weekly?.weekStartsOn ??
        versionOn(habit.schedule, today)?.weekly?.weekStartsOn)
      : undefined) ?? weekStartsOn;
  const { theme, habitColors, habitSurfaces } = useTheme();
  const styles = useThemeStyles(createStyles, theme);
  const reducedMotion = useReducedMotion();
  const [title, setTitle] = useState(habit?.title ?? '');
  const [nameRevision, setNameRevision] = useState(0);
  const [ideasExpanded, setIdeasExpanded] = useState(false);
  const [color, setColor] = useState<ColorKey>(habit?.color ?? 'forest');
  const [icon, setIcon] = useState<IconKey>(habit?.icon ?? 'plant');
  const [days, setDays] = useState<Weekday[]>(
    habit ? plannedDays(habit.schedule) : [...allWeekdays],
  );
  const [typing, setTyping] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [streakTolerance, setStreakTolerance] = useState(
    habit ? plannedTolerance(habit.schedule) : 0,
  );
  const [error, setError] = useMessage();
  function save() {
    let validated: string;
    try {
      validated = habitTitle(title);
      if (!weekly) validateWeekdays(days);
    } catch {
      setError(
        !title.trim() ? 'Use a habit name of 1–80 characters.' : 'Choose at least one weekday.',
      );
      return;
    }
    try {
      onSave({
        title: validated,
        color,
        icon,
        days: weekly ? [...allWeekdays] : days,
        streakTolerance: weekly ? 0 : streakTolerance,
        weekly,
      });
    } catch {
      setError('We couldn’t save your habit. Please try again.');
    }
  }
  return (
    <Modal visible animationType={reducedMotion ? 'none' : 'fade'} onRequestClose={onClose}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safe}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>
              <View style={styles.header}>
                <Pressable
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel={t('Close habit editor')}
                  style={styles.back}
                >
                  <Text style={styles.backText}>‹</Text>
                </Pressable>
                <Text accessibilityRole="header" style={styles.heading}>
                  {habit ? t('Edit habit') : t('New habit')}
                </Text>
                <View style={{ width: 48 }} />
              </View>
              <View style={styles.preview}>
                <HabitIcon color={color} icon={icon} />
                <Text numberOfLines={2} style={styles.previewTitle}>
                  {title.trim() || t('One small step')}
                </Text>
              </View>
              <Text style={styles.label}>{t('Habit name')}</Text>
              <TextInput
                key={nameRevision}
                testID="habit-name"
                accessibilityLabel={t('Habit name')}
                defaultValue={title}
                autoCorrect={false}
                onChangeText={(value) => {
                  setTitle(value);
                  setError('');
                }}
                maxLength={80}
                placeholder={t('e.g. Read one page')}
                placeholderTextColor={theme.muted}
                style={styles.input}
                returnKeyType="done"
                onFocus={() => setTyping(true)}
                onBlur={() => setTyping(false)}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              {typing && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('Done typing')}
                  onPress={() => Keyboard.dismiss()}
                  style={styles.secondary}
                >
                  <Text style={styles.secondaryText}>{t('Done typing')}</Text>
                </Pressable>
              )}
              {!habit && (
                <View style={styles.ideas}>
                  <Pressable
                    testID="toggle-starter-ideas"
                    accessibilityRole="button"
                    accessibilityLabel={t('Need an idea?')}
                    accessibilityState={{ expanded: ideasExpanded }}
                    aria-expanded={ideasExpanded}
                    onPress={() => {
                      Keyboard.dismiss();
                      setIdeasExpanded(!ideasExpanded);
                    }}
                    style={styles.ideasToggle}
                  >
                    <Text style={[styles.secondaryText, { flex: 1 }]}>{t('Need an idea?')}</Text>
                    <Text accessible={false} style={styles.secondaryText}>
                      {ideasExpanded ? '−' : '+'}
                    </Text>
                  </Pressable>
                  {ideasExpanded && (
                    <View style={styles.ideasBody}>
                      <Text accessibilityRole="header" style={styles.label}>
                        {t('A small place to start')}
                      </Text>
                      <Text style={styles.support}>
                        {t(
                          'Choose an idea, then make it yours. Nothing is saved until you create the habit.',
                        )}
                      </Text>
                      {starterIdeas.map((idea) => {
                        const fields = starterIdeaFields(idea, language);
                        const selected =
                          title === fields.title && icon === fields.icon && color === fields.color;
                        return (
                          <Pressable
                            key={idea.id}
                            testID={`starter-idea-${idea.id}`}
                            accessibilityRole="button"
                            accessibilityState={{ selected }}
                            accessibilityLabel={t(
                              selected ? 'Use idea: {title}, selected' : 'Use idea: {title}',
                              { title: fields.title },
                            )}
                            onPress={() => {
                              Keyboard.dismiss();
                              setTyping(false);
                              setTitle(fields.title);
                              setIcon(fields.icon);
                              setColor(fields.color);
                              setError('');
                              // Remount only on deliberate idea selection. Ordinary native typing
                              // stays uncontrolled to avoid cursor/character regressions.
                              setNameRevision((revision) => revision + 1);
                            }}
                            style={[
                              styles.idea,
                              { borderColor: selected ? theme.forest : theme.stone },
                            ]}
                          >
                            <HabitIcon icon={fields.icon} color={fields.color} />
                            <Text style={[styles.label, { flex: 1 }]}>{fields.title}</Text>
                            <Text accessible={false} style={styles.secondaryText}>
                              {selected ? '✓' : '+'}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
              <Text style={styles.label}>{t('Icon')}</Text>
              <View
                style={styles.options}
                accessibilityRole="radiogroup"
                accessibilityLabel={t('Habit icon')}
              >
                {iconKeys.map((key) => (
                  <Pressable
                    key={key}
                    onPress={() => setIcon(key)}
                    accessibilityRole="radio"
                    aria-checked={key === icon}
                    accessibilityState={{ checked: key === icon }}
                    accessibilityLabel={t('{icon} icon', { icon: t(habitIcons[key].label) })}
                    style={[
                      styles.iconOption,
                      {
                        backgroundColor: habitSurfaces[color],
                        borderColor: icon === key ? habitColors[color] : 'transparent',
                      },
                    ]}
                  >
                    <Text maxFontSizeMultiplier={1} style={{ fontSize: 25 }}>
                      {habitIcons[key].glyph}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.label}>{t('Color')}</Text>
              <View
                style={styles.options}
                accessibilityRole="radiogroup"
                accessibilityLabel={t('Habit color')}
              >
                {colorKeys.map((key) => (
                  <Pressable
                    key={key}
                    onPress={() => setColor(key)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: key === color }}
                    aria-checked={key === color}
                    accessibilityLabel={t('{color} color', { color: t(key) })}
                    style={[styles.swatch, { backgroundColor: habitColors[key] }]}
                  >
                    <Text style={{ color: theme.onHabit, fontSize: 22 }}>
                      {color === key ? '✓' : ''}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.label}>{t('Frequency')}</Text>
              <View style={styles.options}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('Every day')}
                  onPress={() => {
                    setWeekly(null);
                    setDays([...allWeekdays]);
                  }}
                  style={[
                    styles.frequency,
                    { backgroundColor: !weekly && days.length === 7 ? theme.mint : theme.surface },
                  ]}
                >
                  <Text style={styles.label}>{t('Every day')}</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('Weekdays')}
                  onPress={() => {
                    setWeekly(null);
                    setDays([1, 2, 3, 4, 5]);
                  }}
                  style={styles.frequency}
                >
                  <Text style={styles.label}>{t('Weekdays')}</Text>
                </Pressable>
                <Pressable
                  testID="frequency-weekly"
                  accessibilityRole="button"
                  accessibilityState={{ selected: !!weekly }}
                  accessibilityLabel={t(weekly ? 'Weekly goal, selected' : 'Weekly goal')}
                  aria-pressed={!!weekly}
                  onPress={() => setWeekly(weekly ?? { target: 3, weekStartsOn: weeklyBoundary })}
                  style={[
                    styles.frequency,
                    { backgroundColor: weekly ? theme.mint : theme.surface },
                  ]}
                >
                  <Text style={styles.label}>
                    {t('Weekly goal')}
                    {weekly ? ' ✓' : ''}
                  </Text>
                </Pressable>
              </View>
              {weekly ? (
                <View style={{ gap: 12 }}>
                  <Text style={styles.label}>{t('Days each week')}</Text>
                  <View style={styles.options}>
                    <Pressable
                      testID="weekly-goal-decrease"
                      accessibilityRole="button"
                      accessibilityLabel={t('Decrease weekly goal')}
                      disabled={weekly.target === 1}
                      accessibilityState={{ disabled: weekly.target === 1 }}
                      onPress={() => setWeekly({ ...weekly, target: weekly.target - 1 })}
                      style={[
                        styles.iconOption,
                        { borderColor: theme.stone, backgroundColor: theme.surface },
                      ]}
                    >
                      <Text style={styles.label}>−</Text>
                    </Pressable>
                    <Text
                      testID="weekly-goal-target"
                      accessible
                      accessibilityLabel={weeklyGoalName(weekly.target)}
                      style={[
                        styles.label,
                        { minWidth: 48, alignSelf: 'center', textAlign: 'center' },
                      ]}
                    >
                      {number(weekly.target)}
                    </Text>
                    <Pressable
                      testID="weekly-goal-increase"
                      accessibilityRole="button"
                      accessibilityLabel={t('Increase weekly goal')}
                      disabled={weekly.target === 7}
                      accessibilityState={{ disabled: weekly.target === 7 }}
                      onPress={() => setWeekly({ ...weekly, target: weekly.target + 1 })}
                      style={[
                        styles.iconOption,
                        { borderColor: theme.stone, backgroundColor: theme.surface },
                      ]}
                    >
                      <Text style={styles.label}>+</Text>
                    </Pressable>
                  </View>
                  <Text style={styles.support}>
                    {t('Choose any days. Each date can hold one win, even after the goal is met.')}
                  </Text>
                  <Text style={styles.support}>
                    {t(
                      'Week: {start} → {end}. This habit keeps this boundary when calendar settings change.',
                      {
                        start: weekdays(0)[weekly.weekStartsOn]!.full,
                        end: weekdays(0)[weekly.weekStartsOn === 1 ? 0 : 6]!.full,
                      },
                    )}
                  </Text>
                </View>
              ) : (
                <View
                  style={styles.options}
                  role="group"
                  accessibilityLabel={t('Scheduled weekdays')}
                >
                  {([1, 2, 3, 4, 5, 6, 0] as Weekday[]).map((day) => (
                    <Pressable
                      key={day}
                      accessibilityRole="checkbox"
                      aria-checked={days.includes(day)}
                      accessibilityState={{ checked: days.includes(day) }}
                      hitSlop={4}
                      accessibilityLabel={
                        [
                          t('Sunday'),
                          t('Monday'),
                          t('Tuesday'),
                          t('Wednesday'),
                          t('Thursday'),
                          t('Friday'),
                          t('Saturday'),
                        ][day]
                      }
                      onPress={() =>
                        setDays(
                          days.includes(day)
                            ? days.filter((value) => value !== day)
                            : [...days, day],
                        )
                      }
                      style={[
                        styles.day,
                        { backgroundColor: days.includes(day) ? theme.forest : theme.surface },
                      ]}
                    >
                      <Text
                        style={{
                          fontFamily: 'Inter_600SemiBold',
                          color: days.includes(day) ? theme.onPrimary : theme.forest,
                          fontSize: 13,
                        }}
                      >
                        {weekdayChoice(day)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
              <Text style={styles.support}>
                {habit &&
                (weekly ||
                  plannedVersion(habit.schedule).weekly ||
                  versionOn(habit.schedule, today)?.weekly)
                  ? t('Weekly changes start next week. Earlier dates stay unchanged.')
                  : habit
                    ? t('Frequency changes start tomorrow. Past wins stay on their original dates.')
                    : t('Choose the days that work for you.')}
              </Text>
              {weekly ? (
                <Text style={styles.support}>
                  {t(
                    'Weekly goals have room for rest days. Daily streak tolerance does not apply.',
                  )}
                </Text>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: advanced }}
                  onPress={() => setAdvanced(!advanced)}
                  style={styles.secondary}
                >
                  <Text style={styles.secondaryText}>
                    {t('Advanced options')}
                    {streakTolerance > 0
                      ? count(
                          streakTolerance,
                          ' · {count} day tolerance',
                          ' · {count} days tolerance',
                        )
                      : ''}{' '}
                    {advanced ? '−' : '+'}
                  </Text>
                </Pressable>
              )}
              {advanced && !weekly && (
                <View style={styles.preview}>
                  <View style={{ flex: 1, gap: 8 }}>
                    <Text style={styles.label}>{t('Streak flexibility')}</Text>
                    <Text style={styles.support}>
                      {count(
                        streakTolerance,
                        'Allow up to {count} missed scheduled day between wins. Each win renews the allowance.',
                        'Allow up to {count} missed scheduled days between wins. Each win renews the allowance.',
                      )}
                    </Text>
                    <View style={styles.options}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={t('Decrease streak tolerance')}
                        disabled={streakTolerance === 0}
                        accessibilityState={{ disabled: streakTolerance === 0 }}
                        onPress={() => setStreakTolerance(streakTolerance - 1)}
                        style={styles.iconOption}
                      >
                        <Text style={styles.label}>−</Text>
                      </Pressable>
                      <Text
                        accessible
                        testID="streak-tolerance"
                        accessibilityLabel={count(
                          streakTolerance,
                          '{count} scheduled day of tolerance',
                          '{count} scheduled days of tolerance',
                        )}
                        style={[
                          styles.label,
                          { minWidth: 48, textAlign: 'center', alignSelf: 'center' },
                        ]}
                      >
                        {number(streakTolerance)}
                      </Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={t('Increase streak tolerance')}
                        disabled={streakTolerance === 7}
                        accessibilityState={{ disabled: streakTolerance === 7 }}
                        onPress={() => setStreakTolerance(streakTolerance + 1)}
                        style={styles.iconOption}
                      >
                        <Text style={styles.label}>+</Text>
                      </Pressable>
                    </View>
                    <Text style={styles.support}>
                      {t(
                        'Soft ○ tiles keep your rhythm visible. Only completed days count as wins.',
                      )}
                      {habit ? t(' Changes start tomorrow.') : ''}
                    </Text>
                  </View>
                </View>
              )}
              {!!error && (
                <Text accessibilityRole="alert" style={styles.error}>
                  {error}
                </Text>
              )}
              <Pressable
                testID="save-habit"
                onPress={save}
                accessibilityRole="button"
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {habit ? t('Save changes') : t('Create habit')}
                </Text>
              </Pressable>
              {habit && (
                <View style={styles.archive}>
                  <Text style={styles.support}>
                    {t('Taking a break? Your past wins will stay here.')}
                  </Text>
                  <Pressable
                    onPress={onArchive}
                    accessibilityRole="button"
                    style={styles.secondary}
                  >
                    <Text style={styles.secondaryText}>{t('Archive habit')}</Text>
                  </Pressable>
                </View>
              )}
              <Pressable onPress={onClose} accessibilityRole="button" style={styles.secondary}>
                <Text style={styles.support}>{t('Cancel')}</Text>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}
const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.ivory },
    page: {
      padding: 16,
      gap: 16,
      width: '100%',
      maxWidth: 560,
      alignSelf: 'center',
      paddingBottom: 32,
    },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    heading: { fontFamily: 'Fraunces_600SemiBold', fontSize: 24, color: theme.forest },
    back: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
    backText: { fontSize: 32, color: theme.forest },
    preview: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      borderRadius: 18,
      backgroundColor: theme.surface,
    },
    previewTitle: {
      flex: 1,
      fontFamily: 'Fraunces_600SemiBold',
      fontSize: 23,
      color: theme.forest,
    },
    label: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: theme.charcoal },
    input: {
      padding: 16,
      minHeight: 54,
      fontFamily: 'Inter_400Regular',
      fontSize: 17,
      borderRadius: 13,
      backgroundColor: theme.surface,
      color: theme.charcoal,
      borderWidth: 1,
      borderColor: theme.stone,
    },
    ideas: { borderRadius: 16, backgroundColor: theme.surface },
    ideasToggle: {
      minHeight: 48,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    ideasBody: { padding: 12, paddingTop: 0, gap: 10 },
    idea: {
      minHeight: 64,
      padding: 10,
      borderRadius: 13,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    iconOption: {
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 13,
      borderWidth: 2,
    },
    swatch: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    day: {
      minWidth: 40,
      minHeight: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    frequency: {
      minHeight: 48,
      borderRadius: 13,
      backgroundColor: theme.frequency,
      padding: 14,
      gap: 5,
    },
    support: { fontFamily: 'Inter_400Regular', fontSize: 13, color: theme.muted, lineHeight: 20 },
    error: { color: theme.charcoal, fontFamily: 'Inter_400Regular' },
    button: {
      minHeight: 52,
      padding: 16,
      borderRadius: 13,
      backgroundColor: theme.forest,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: { color: theme.onPrimary, fontFamily: 'Inter_600SemiBold', fontSize: 16 },
    secondary: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
    secondaryText: { color: theme.forest, fontFamily: 'Inter_600SemiBold', fontSize: 15 },
    archive: { alignItems: 'center', gap: 5 },
  });
