import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { HistoryCell } from '../domain/habit';
import { theme } from '../theme/tokens';
export function DayInspector({
  cell,
  habitTitle,
  editable,
  onChange,
  onClose,
}: {
  cell: HistoryCell;
  habitTitle?: string;
  editable: boolean;
  onChange(completed: boolean): void;
  onClose(): void;
}) {
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
    missed: 'A new start is always possible.',
    'before-start': 'This date is before your habit started.',
    'not-scheduled': 'A day to rest. Nothing was planned.',
    future: 'This day is still ahead.',
  }[cell.state];
  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheet}>
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
          {!!error && (
            <Text accessibilityRole="alert" style={styles.text}>
              {error}
            </Text>
          )}
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.close}>
            <Text style={styles.text}>Close day</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#00000044', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: theme.ivory,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 16,
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
  buttonText: { color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  close: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
});
