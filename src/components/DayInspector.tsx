import { noteLimit } from '../domain/notes';
import { useState } from 'react';
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
  editable,
  note,
  noteEditable,
  onSaveNote,
  onChange,
  onClose,
}: {
  cell: HistoryCell;
  habitTitle?: string;
  editable: boolean;
  note: string;
  noteEditable: boolean;
  onSaveNote(text: string): void;
  onChange(completed: boolean): void;
  onClose(): void;
}) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles, theme);
  const [draft, setDraft] = useState(note);
  const [typing, setTyping] = useState(false);
  const [savedNote, setSavedNote] = useState(note);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const label = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${cell.day}T12:00:00Z`));
  const status = {
    complete: 'A win worth keeping.',
    grace: 'A little breathing room. Your sequence stayed intact; this day is not a completed win.',
    missed: 'A new start is always possible.',
    'before-start': 'This date is before your habit started.',
    'not-scheduled': 'A day to rest. Nothing was planned.',
    future: 'This day is still ahead.',
  }[cell.state];
  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <SafeAreaProvider>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.overlay}
        >
          <SafeAreaView style={styles.sheet}>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
              {!!habitTitle && <Text style={styles.text}>{habitTitle}</Text>}
              <Text accessibilityRole="header" style={styles.title}>
                {label}
              </Text>
              <Text style={styles.text}>{status}</Text>
              {editable && (
                <>
                  <Text style={styles.text}>This changes only the completion on {cell.day}.</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${cell.state === 'complete' ? 'Undo completion' : 'Mark completed'} for ${cell.day}`}
                    onPress={() => {
                      try {
                        onChange(cell.state !== 'complete');
                        setError('');
                      } catch {
                        setError('Could not save this day. Please try again.');
                      }
                    }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>
                      {cell.state === 'complete' ? 'Undo completion' : 'Mark completed'}
                    </Text>
                  </Pressable>
                </>
              )}
              {(noteEditable || !!note) && (
                <View style={styles.noteSection}>
                  <Text style={styles.noteTitle}>A little context</Text>
                  {noteEditable ? (
                    <>
                      <Text style={styles.text}>
                        An optional note for this day. It won’t change your win.
                      </Text>
                      <TextInput
                        testID="day-note"
                        accessibilityLabel={`Note for ${cell.day}`}
                        value={draft}
                        onChangeText={(value) => {
                          setDraft(value);
                          setMessage('');
                        }}
                        multiline
                        maxLength={noteLimit}
                        placeholder="What would you like to remember?"
                        placeholderTextColor={theme.muted}
                        onFocus={() => setTyping(true)}
                        onBlur={() => setTyping(false)}
                        style={styles.noteInput}
                      />
                      <Text style={styles.text}>
                        {draft.length}/{noteLimit}
                      </Text>
                      {typing && (
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => Keyboard.dismiss()}
                          style={styles.close}
                        >
                          <Text style={styles.text}>Done typing</Text>
                        </Pressable>
                      )}
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
                            setMessage(text ? 'Note saved.' : 'Note cleared.');
                            setError('');
                            Keyboard.dismiss();
                          } catch (failure) {
                            setError(
                              failure instanceof Error
                                ? failure.message
                                : 'Could not save this note. Please try again.',
                            );
                          }
                        }}
                        style={[styles.button, draft === savedNote && { opacity: 0.5 }]}
                      >
                        <Text style={styles.buttonText}>Save note</Text>
                      </Pressable>
                      {!!draft && (
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => {
                            setDraft('');
                            setMessage('Press Save note to clear it.');
                          }}
                          style={styles.close}
                        >
                          <Text style={styles.text}>Clear note</Text>
                        </Pressable>
                      )}
                    </>
                  ) : (
                    <Text style={styles.text}>{note}</Text>
                  )}
                </View>
              )}
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
              <Pressable accessibilityRole="button" onPress={onClose} style={styles.close}>
                <Text style={styles.text}>Close day</Text>
              </Pressable>
            </ScrollView>
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
      maxHeight: '90%',
    },
    content: { padding: 24, gap: 16 },
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
