import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRepository } from '../database/provider';
import { parseBackup, serializeBackup, type Backup } from '../domain/backup';
import { chooseBackupFile, saveBackupFile } from '../features/backups/files';
import { deviceClock } from '../lib/clock';
import { useTheme, useThemeStyles } from '../theme/useTheme';
import type { ThemePalette } from '../theme/tokens';
export function BackupControls() {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles, theme);
  const repository = useRepository();
  const [pending, setPending] = useState<Backup | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function exportFile() {
    setBusy(true);
    setMessage('');
    try {
      const now = deviceClock.now();
      const source = serializeBackup(
        repository.listHabits(),
        repository.listCompletions(),
        now,
        repository.listNotes(),
      );
      await saveBackupFile(
        source,
        `tiny-wins-${now.toISOString().replaceAll(':', '-')}.tinywins.json`,
      );
      setMessage('Backup file prepared. Keep it somewhere safe.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not create a backup.');
    } finally {
      setBusy(false);
    }
  }
  async function selectFile() {
    setBusy(true);
    setMessage('');
    setPending(null);
    try {
      const source = await chooseBackupFile();
      if (source !== null) setPending(parseBackup(source));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not read this backup.');
    } finally {
      setBusy(false);
    }
  }
  function restore() {
    if (!pending) return;
    setBusy(true);
    try {
      const result = repository.mergeBackup(pending);
      setMessage(
        `${result.habitsAdded} habits and ${result.winsAdded} wins and ${result.notesAdded} notes added. Your existing habits were kept.`,
      );
      setPending(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not restore this backup.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.heading}>
        Keep your tiny wins
      </Text>
      <Text style={styles.copy}>
        Save a backup file to move or keep a copy of your habits, schedules, notes and history. Your
        file contains your habit data; choose where to save it.
      </Text>
      <Pressable
        accessibilityRole="button"
        disabled={busy}
        accessibilityState={{ disabled: busy }}
        onPress={() => void exportFile()}
        style={styles.primary}
      >
        <Text style={styles.primaryText}>Export backup</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        disabled={busy}
        accessibilityState={{ disabled: busy }}
        onPress={() => void selectFile()}
        style={styles.secondary}
      >
        <Text style={styles.secondaryText}>Choose backup to restore</Text>
      </Pressable>
      {pending && (
        <View style={styles.review}>
          <Text style={styles.heading}>Ready to restore</Text>
          <Text style={styles.copy}>
            {pending.habits.length} habits · {pending.completions.length} wins ·{' '}
            {pending.notes.length} notes
          </Text>
          <Text style={styles.copy}>
            Adds missing habits, wins and notes. Existing note text is kept. Existing names, colors,
            schedules and order stay as you have them.
          </Text>
          <Pressable accessibilityRole="button" onPress={restore} style={styles.primary}>
            <Text style={styles.primaryText}>Restore missing data</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setPending(null)}
            style={styles.secondary}
          >
            <Text style={styles.secondaryText}>Cancel restore</Text>
          </Pressable>
        </View>
      )}
      {!!message && (
        <Text accessibilityRole="alert" style={styles.copy}>
          {message}
        </Text>
      )}
      {busy && (
        <Text role="status" style={styles.copy}>
          Preparing your file…
        </Text>
      )}
    </View>
  );
}
const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    card: {
      padding: 18,
      gap: 12,
      borderRadius: 16,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.stone,
    },
    heading: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: theme.forest },
    copy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: theme.muted },
    primary: {
      minHeight: 52,
      padding: 14,
      borderRadius: 13,
      backgroundColor: theme.forest,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: theme.onPrimary },
    secondary: { minHeight: 48, alignItems: 'center', justifyContent: 'center', padding: 10 },
    secondaryText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: theme.forest },
    review: { padding: 14, borderRadius: 13, backgroundColor: theme.mint, gap: 12 },
  });
