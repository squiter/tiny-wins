import { useI18n } from '../features/localization/provider';
import { noteLimit } from '../domain/notes';
import { useEffect, useRef, useState } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useCelebrations } from '../features/feedback/provider';
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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import type { HistoryCell } from '../domain/habit';
import { useTheme, useThemeStyles } from '../theme/useTheme';
import type { ThemePalette } from '../theme/tokens';
export function DayInspector({
  cell,
  habitTitle,
  habitId,
  editable,
  note,
  noteEditable,
  onSaveNote,
  onChange,
  onClose,
}: {
  cell: HistoryCell;
  habitTitle?: string;
  habitId: string;
  editable: boolean;
  note: string;
  noteEditable: boolean;
  onSaveNote(text: string): void;
  onChange(completed: boolean): void;
  onClose(): void;
}) {
  const { t, language, number, failure: localizedFailure } = useI18n();
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles, theme);
  const { event, animationsAllowed } = useCelebrations();
  const lastEvent = useRef(event?.serial ?? 0);
  const scale = useSharedValue(1);
  useEffect(() => {
    const fresh = !!event && event.serial !== lastEvent.current;
    if (event) lastEvent.current = event.serial;
    if (fresh && animationsAllowed && event.habitId === habitId && event.day === cell.day)
      scale.value = withSequence(
        withTiming(1.03, { duration: 150 }),
        withTiming(1, { duration: 220 }),
      );
    if (!animationsAllowed || !event) scale.value = 1;
  }, [event, animationsAllowed, habitId, cell.day, scale]);
  const feedbackStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const [draft, setDraft] = useState(note);
  const [typing, setTyping] = useState(false);
  const [savedNote, setSavedNote] = useState(note);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const label = new Intl.DateTimeFormat(language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${cell.day}T12:00:00Z`));
  const status = {
    complete: t('A win worth keeping.'),
    grace: t(
      'A little breathing room. Your sequence stayed intact; this day is not a completed win.',
    ),
    missed: t('A new start is always possible.'),
    'before-start': t('This date is before your habit started.'),
    'not-scheduled': t('A day to rest. Nothing was planned.'),
    future: t('This day is still ahead.'),
  }[cell.state];
  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <SafeAreaProvider>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'height' : undefined}
          style={styles.overlay}
        >
          <SafeAreaView style={[styles.sheet, !noteEditable && { height: note ? '65%' : '45%' }]}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
              contentContainerStyle={styles.content}
            >
              {!!habitTitle && <Text style={styles.text}>{habitTitle}</Text>}
              <Text accessibilityRole="header" style={styles.title}>
                {label}
              </Text>
              <Text style={styles.text}>{status}</Text>
              {editable && (
                <>
                  <Text style={styles.text}>
                    {t('This changes only the completion on {date}.', { date: label })}
                  </Text>
                  <Animated.View style={feedbackStyle}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={t(
                        cell.state === 'complete'
                          ? 'Undo completion for {date}'
                          : 'Mark completed for {date}',
                        { date: label },
                      )}
                      onPress={() => {
                        try {
                          onChange(cell.state !== 'complete');
                          setError('');
                        } catch {
                          setError(t('Could not save this day. Please try again.'));
                        }
                      }}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>
                        {cell.state === 'complete' ? t('Undo completion') : t('Mark completed')}
                      </Text>
                    </Pressable>
                  </Animated.View>
                </>
              )}
              {(noteEditable || !!note) && (
                <View style={styles.noteSection}>
                  <Text style={styles.noteTitle}>{t('A little context')}</Text>
                  {noteEditable ? (
                    <>
                      <Text style={styles.text}>
                        {t('An optional note for this day. It won’t change your win.')}
                      </Text>
                      <TextInput
                        testID="day-note"
                        accessibilityLabel={t('Note for {date}', { date: label })}
                        value={draft}
                        onChangeText={(value) => {
                          setDraft(value);
                          setMessage('');
                        }}
                        multiline
                        maxLength={noteLimit}
                        placeholder={t('What would you like to remember?')}
                        placeholderTextColor={theme.muted}
                        onFocus={() => setTyping(true)}
                        onBlur={() => setTyping(false)}
                        style={styles.noteInput}
                      />
                      <Text style={styles.text}>
                        {number(draft.length)}/{number(noteLimit)}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.text}>{note}</Text>
                  )}
                </View>
              )}
            </ScrollView>
            <View style={styles.footer}>
              {!!message && (
                <Text accessibilityRole="alert" style={styles.text}>
                  {message}
                </Text>
              )}
              {!!error && (
                <Text accessibilityRole="alert" style={styles.text}>
                  {error}
                </Text>
              )}
              {typing ? (
                <Pressable
                  testID="day-note-done-typing"
                  accessibilityRole="button"
                  onPress={() => Keyboard.dismiss()}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>{t('Done typing')}</Text>
                </Pressable>
              ) : (
                noteEditable && (
                  <View style={styles.noteActions}>
                    <Pressable
                      testID="save-day-note"
                      accessibilityRole="button"
                      accessibilityState={{ disabled: draft === savedNote }}
                      disabled={draft === savedNote}
                      onPress={() => {
                        try {
                          onSaveNote(draft);
                          const text = draft.trim();
                          setDraft(text);
                          setSavedNote(text);
                          setMessage(text ? t('Note saved.') : t('Note cleared.'));
                          setError('');
                          Keyboard.dismiss();
                        } catch (failure) {
                          setError(
                            localizedFailure(
                              failure,
                              'Could not save this note. Please try again.',
                            ),
                          );
                        }
                      }}
                      style={[
                        styles.button,
                        styles.noteAction,
                        draft === savedNote && { opacity: 0.5 },
                      ]}
                    >
                      <Text style={styles.buttonText}>{t('Save note')}</Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ disabled: !draft }}
                      disabled={!draft}
                      onPress={() => {
                        setDraft('');
                        setMessage(t('Press Save note to clear it.'));
                      }}
                      style={[styles.close, styles.noteAction, !draft && { opacity: 0.5 }]}
                    >
                      <Text style={styles.text}>{t('Clear note')}</Text>
                    </Pressable>
                  </View>
                )
              )}
              <Pressable accessibilityRole="button" onPress={onClose} style={styles.close}>
                <Text style={styles.text}>{t('Close day')}</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </Modal>
  );
}
const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    overlay: { flex: 1, backgroundColor: theme.overlay, justifyContent: 'flex-end' },
    sheet: {
      backgroundColor: theme.ivory,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      height: '90%',
    },
    content: { padding: 24, gap: 16 },
    footer: {
      paddingHorizontal: 24,
      paddingTop: 12,
      gap: 8,
      borderTopWidth: 1,
      borderColor: theme.stone,
    },
    noteActions: { flexDirection: 'row', gap: 12 },
    noteAction: { flex: 1 },
    noteSection: { gap: 12, paddingTop: 16, borderTopWidth: 1, borderColor: theme.stone },
    noteTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: theme.forest },
    noteInput: {
      minHeight: 100,
      padding: 14,
      textAlignVertical: 'top',
      borderWidth: 1,
      borderColor: theme.stone,
      borderRadius: 12,
      backgroundColor: theme.surface,
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      color: theme.charcoal,
    },
    title: { fontFamily: 'Fraunces_600SemiBold', fontSize: 25, color: theme.forest },
    text: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 23, color: theme.muted },
    button: {
      minHeight: 52,
      borderRadius: 13,
      backgroundColor: theme.forest,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    buttonText: { color: theme.onPrimary, fontFamily: 'Inter_600SemiBold', fontSize: 15 },
    close: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  });
