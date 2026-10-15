import type { MessageKey, MessageValues } from '../../features/localization/messages';
import { useI18n, useMessage } from '../../features/localization/provider';
import { useCelebrations } from '../../features/feedback/provider';
import { CozyNote } from '../../components/CozyNote';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { randomUUID } from 'expo-crypto';
import { useRepository } from '../../database/provider';
import { localDay } from '../../domain/calendar';
import { scheduledOn } from '../../domain/schedule';
import type { Habit } from '../../domain/habit';
import { createHabit, toggleToday } from '../../features/check-ins/service';
import { archiveHabit, editHabit, moveHabit, restoreHabit } from '../../features/habits/service';
import { deviceClock } from '../../lib/clock';
import { DailyProgress } from '../../components/DailyProgress';
import { HabitCard } from '../../components/HabitCard';
import { HabitEditor, type HabitDraft } from '../../components/HabitEditor';
import { HabitIcon } from '../../components/HabitIcon';
import { useTheme, useThemeStyles } from '../../theme/useTheme';
import type { ThemePalette } from '../../theme/tokens';

export default function Today() {
  const { announce } = useCelebrations();
  const { t, count, language } = useI18n();
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles, theme);
  const repository = useRepository();
  const params = useLocalSearchParams<{ archived?: string }>();
  const [, refresh] = useState(0);
  const [editor, setEditor] = useState<{ habit: Habit | null } | null>(null);
  const [ordering, setOrdering] = useState(false);
  const [archived, setArchived] = useState(false);
  const [notice, setNotice] = useMessage();
  const update = useCallback(() => refresh((value) => value + 1), []);
  useFocusEffect(
    useCallback(() => {
      update();
      setArchived(params.archived === '1');
    }, [update, params.archived]),
  );
  useEffect(() => {
    const listener = AppState.addEventListener('change', (state) => {
      if (state === 'active') update();
    });
    const timer = setInterval(update, 30_000);
    return () => {
      listener.remove();
      clearInterval(timer);
    };
  }, [update]);
  const today = localDay(deviceClock.now(), deviceClock.timezone());
  const allHabits = repository.listHabits();
  const activeHabits = allHabits.filter((habit) => !habit.archivedAt);
  const archivedHabits = allHabits.filter((habit) => !!habit.archivedAt);
  const completions = repository.listCompletions();
  const notes = repository.listNotes();
  const dueHabits = activeHabits.filter((habit) => scheduledOn(habit.schedule, today));
  const wins = dueHabits.filter((habit) =>
    completions.some((record) => record.habitId === habit.id && record.localDate === today),
  ).length;
  const dateLabel = new Intl.DateTimeFormat(language, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${today}T12:00:00Z`));
  function save(draft: HabitDraft) {
    if (editor?.habit)
      editHabit(
        repository,
        editor.habit.id,
        draft.title,
        draft.color,
        draft.icon,
        deviceClock,
        draft.days,
        draft.streakTolerance,
      );
    else
      createHabit(
        repository,
        deviceClock,
        randomUUID(),
        draft.title,
        draft.color,
        draft.icon,
        draft.days,
        draft.streakTolerance,
      );
    update();
    setEditor(null);
    setArchived(false);
    setNotice('');
  }
  function mutate(operation: () => void, message: MessageKey | '' = '', values?: MessageValues) {
    try {
      operation();
      update();
      setNotice(message, values);
    } catch {
      setNotice('We couldn’t save that change. Please try again.');
    }
  }
  function archive() {
    const habit = editor?.habit;
    if (!habit) return;
    try {
      archiveHabit(repository, deviceClock, habit.id);
      update();
      setEditor(null);
      setNotice('{title} archived. You can restore it below.', { title: habit.title });
    } catch {
      setNotice('We couldn’t archive your habit. Please try again.');
    }
  }
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <View accessible={false} style={styles.brandMark}>
            {[theme.sage, theme.apricot, theme.forest, theme.sage].map((color, index) => (
              <View
                key={index}
                style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: color }}
              />
            ))}
          </View>
          <Text style={styles.brandText}>tiny wins</Text>
        </View>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text accessibilityRole="header" style={styles.heading}>
              {archived ? t('Archived') : t('Today')}
            </Text>
            <Text style={styles.date}>
              {archived ? t('Your wins are always yours.') : dateLabel}
            </Text>
          </View>
          <Pressable
            testID="add-habit"
            accessibilityRole="button"
            accessibilityLabel={t('New habit')}
            onPress={() => setEditor({ habit: null })}
            style={styles.add}
          >
            <Text maxFontSizeMultiplier={1} style={styles.addText}>
              +
            </Text>
          </Pressable>
        </View>
        {!archived && <DailyProgress wins={wins} planned={dueHabits.length} />}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {archived
              ? count(archivedHabits.length, '{count} saved habit', '{count} saved habits')
              : t('Your habits')}
          </Text>
          {!archived && activeHabits.length > 1 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={ordering ? t('Done reordering') : t('Reorder habits')}
              onPress={() => setOrdering(!ordering)}
              style={styles.textButton}
            >
              <Text style={styles.link}>{ordering ? t('Done') : t('Reorder')}</Text>
            </Pressable>
          )}
        </View>
        {!!notice && (
          <View accessibilityRole="alert" style={styles.notice}>
            <Text style={[styles.support, { flex: 1 }]}>{notice}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('Dismiss message')}
              onPress={() => setNotice('')}
              style={styles.dismiss}
            >
              <Text style={styles.link}>×</Text>
            </Pressable>
          </View>
        )}
        {!archived && activeHabits.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>{t('Start with one small thing.')}</Text>
            <Text style={styles.emptyCopy}>
              {t('A glass of water. A page of a book. A moment to breathe. Make it yours.')}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setEditor({ habit: null })}
              style={styles.primary}
            >
              <Text style={styles.primaryText}>{t('Create your first habit')}</Text>
            </Pressable>
          </View>
        )}
        {!archived &&
          activeHabits.map((habit, index) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              completions={completions}
              notes={notes}
              today={today}
              onView={() => router.push({ pathname: '/habit/[id]', params: { id: habit.id } })}
              onInspect={(day) =>
                router.push({ pathname: '/habit/[id]', params: { id: habit.id, day } })
              }
              onToggle={() =>
                mutate(() => announce(toggleToday(repository, deviceClock, habit.id)))
              }
              ordering={
                ordering
                  ? {
                      first: index === 0,
                      last: index === activeHabits.length - 1,
                      move: (direction) => mutate(() => moveHabit(repository, habit.id, direction)),
                    }
                  : undefined
              }
            />
          ))}
        {archived && archivedHabits.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>{t('Nothing tucked away.')}</Text>
            <Text style={styles.emptyCopy}>
              {t('Archived habits appear here, with their past wins kept safe.')}
            </Text>
          </View>
        )}
        {archived &&
          archivedHabits.map((habit) => (
            <View key={habit.id} style={styles.archivedRow}>
              <HabitIcon color={habit.color} icon={habit.icon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.habitTitle}>{habit.title}</Text>
                <Text style={styles.support}>{t('Past wins are saved')}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('Restore {title}', { title: habit.title })}
                onPress={() =>
                  mutate(
                    () => restoreHabit(repository, habit.id, deviceClock),
                    '{title} restored. Find it in Today.',
                    { title: habit.title },
                  )
                }
                style={styles.restore}
              >
                <Text style={styles.link}>{t('Restore')}</Text>
              </Pressable>
            </View>
          ))}
        {!archived && activeHabits.length > 0 && (
          <Text style={styles.legend}>
            {t('Past 14 days · today outlined · soft ○ within tolerance')}
          </Text>
        )}
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setArchived(!archived);
            setOrdering(false);
            setNotice('');
          }}
          style={styles.archiveLink}
        >
          <Text style={styles.link}>
            {archived
              ? t('← Back to Today')
              : t('Archived habits ({count})', { count: archivedHabits.length })}
          </Text>
        </Pressable>
        <CozyNote message={t('Consistency over perfection.')} />
      </ScrollView>
      {editor && (
        <HabitEditor
          key={editor.habit?.id ?? 'new'}
          habit={editor.habit}
          onSave={save}
          onClose={() => setEditor(null)}
          onArchive={archive}
        />
      )}
    </SafeAreaView>
  );
}
const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.ivory },
    page: {
      padding: 16,
      paddingBottom: 32,
      gap: 10,
      width: '100%',
      maxWidth: 540,
      alignSelf: 'center',
    },
    brand: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
    brandMark: { width: 19, flexDirection: 'row', gap: 3, flexWrap: 'wrap' },
    brandText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      letterSpacing: 0.4,
      color: theme.muted,
    },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8, marginTop: 6 },
    heading: { fontFamily: 'Fraunces_600SemiBold', fontSize: 34, color: theme.forest },
    date: { fontFamily: 'Inter_400Regular', fontSize: 13, color: theme.muted, marginTop: 5 },
    add: {
      width: 48,
      minHeight: 48,
      borderRadius: 24,
      backgroundColor: theme.forest,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addText: { color: theme.onPrimary, fontSize: 30 },
    support: { fontFamily: 'Inter_400Regular', fontSize: 12, color: theme.muted, lineHeight: 19 },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 48,
    },
    sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: theme.charcoal },
    textButton: { minHeight: 48, minWidth: 64, justifyContent: 'center', alignItems: 'flex-end' },
    link: { fontFamily: 'Inter_600SemiBold', color: theme.forest, fontSize: 13 },
    notice: {
      backgroundColor: theme.mint,
      borderRadius: 12,
      paddingLeft: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    dismiss: {
      minWidth: 48,
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 'auto',
    },
    empty: {
      gap: 14,
      backgroundColor: theme.surface,
      boxShadow: theme.cardShadow,
      borderWidth: 1,
      borderColor: theme.stone,
      borderRadius: 18,
      padding: 20,
    },
    emptyTitle: { fontFamily: 'Fraunces_600SemiBold', color: theme.forest, fontSize: 24 },
    emptyCopy: { fontFamily: 'Inter_400Regular', color: theme.muted, fontSize: 15, lineHeight: 23 },
    primary: {
      minHeight: 52,
      backgroundColor: theme.forest,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 14,
    },
    primaryText: { fontFamily: 'Inter_600SemiBold', color: theme.onPrimary, fontSize: 15 },
    legend: {
      color: theme.muted,
      fontFamily: 'Inter_400Regular',
      fontSize: 11,
      textAlign: 'center',
      marginTop: 4,
    },
    archiveLink: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
    footer: {
      fontFamily: 'Fraunces_600SemiBold',
      color: theme.muted,
      fontSize: 17,
      textAlign: 'center',
      marginTop: 8,
    },
    archivedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.stone,
    },
    habitTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: theme.charcoal },
    restore: { minHeight: 48, paddingHorizontal: 10, justifyContent: 'center' },
  });
