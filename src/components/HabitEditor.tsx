import { useState } from 'react';
import {
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
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  colorKeys,
  habitTitle,
  iconKeys,
  type ColorKey,
  type Habit,
  type IconKey,
} from '../domain/habit';
import { habitColors, habitSurfaces, theme } from '../theme/tokens';
import { habitIcons, HabitIcon } from './HabitIcon';
export interface HabitDraft {
  title: string;
  color: ColorKey;
  icon: IconKey;
}
interface Props {
  habit: Habit | null;
  onSave(draft: HabitDraft): void;
  onClose(): void;
  onArchive(): void;
}
export function HabitEditor({ habit, onSave, onClose, onArchive }: Props) {
  const reducedMotion = useReducedMotion();
  const [title, setTitle] = useState(habit?.title ?? '');
  const [color, setColor] = useState<ColorKey>(habit?.color ?? 'forest');
  const [icon, setIcon] = useState<IconKey>(habit?.icon ?? 'plant');
  const [error, setError] = useState('');
  function save() {
    let validated: string;
    try {
      validated = habitTitle(title);
    } catch {
      setError('Use a habit name of 1–80 characters.');
      return;
    }
    try {
      onSave({ title: validated, color, icon });
    } catch {
      setError('We couldn’t save your habit. Please try again.');
    }
  }
  return (
    <Modal visible animationType={reducedMotion ? 'none' : 'fade'} onRequestClose={onClose}>
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
                accessibilityLabel="Close habit editor"
                style={styles.back}
              >
                <Text style={styles.backText}>‹</Text>
              </Pressable>
              <Text accessibilityRole="header" style={styles.heading}>
                {habit ? 'Edit habit' : 'New habit'}
              </Text>
              <View style={{ width: 48 }} />
            </View>
            <View style={styles.preview}>
              <HabitIcon color={color} icon={icon} />
              <Text numberOfLines={2} style={styles.previewTitle}>
                {title.trim() || 'One small step'}
              </Text>
            </View>
            <Text style={styles.label}>Habit name</Text>
            <TextInput
              testID="habit-name"
              accessibilityLabel="Habit name"
              value={title}
              onChangeText={(value) => {
                setTitle(value);
                setError('');
              }}
              maxLength={80}
              placeholder="e.g. Read one page"
              placeholderTextColor={theme.muted}
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={save}
            />
            <Text style={styles.label}>Icon</Text>
            <View
              style={styles.options}
              accessibilityRole="radiogroup"
              accessibilityLabel="Habit icon"
            >
              {iconKeys.map((key) => (
                <Pressable
                  key={key}
                  onPress={() => setIcon(key)}
                  accessibilityRole="radio"
                  aria-checked={key === icon}
                  accessibilityState={{ checked: key === icon }}
                  accessibilityLabel={`${habitIcons[key].label} icon`}
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
            <Text style={styles.label}>Color</Text>
            <View
              style={styles.options}
              accessibilityRole="radiogroup"
              accessibilityLabel="Habit color"
            >
              {colorKeys.map((key) => (
                <Pressable
                  key={key}
                  onPress={() => setColor(key)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: key === color }}
                  aria-checked={key === color}
                  accessibilityLabel={`${key} color`}
                  style={[styles.swatch, { backgroundColor: habitColors[key] }]}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 22 }}>{color === key ? '✓' : ''}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.frequency}>
              <Text style={styles.label}>Every day</Text>
              <Text style={styles.support}>Make a little room for your daily win.</Text>
            </View>
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
              <Text style={styles.buttonText}>{habit ? 'Save changes' : 'Create habit'}</Text>
            </Pressable>
            {habit && (
              <View style={styles.archive}>
                <Text style={styles.support}>Taking a break? Your past wins will stay here.</Text>
                <Pressable onPress={onArchive} accessibilityRole="button" style={styles.secondary}>
                  <Text style={styles.secondaryText}>Archive habit</Text>
                </Pressable>
              </View>
            )}
            <Pressable onPress={onClose} accessibilityRole="button" style={styles.secondary}>
              <Text style={styles.support}>Cancel</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
const styles = StyleSheet.create({
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
    backgroundColor: '#FFFFFF',
  },
  previewTitle: { flex: 1, fontFamily: 'Fraunces_600SemiBold', fontSize: 23, color: theme.forest },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: theme.charcoal },
  input: {
    padding: 16,
    minHeight: 54,
    fontFamily: 'Inter_400Regular',
    fontSize: 17,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.stone,
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
  frequency: { borderRadius: 13, backgroundColor: '#ECEFE8', padding: 14, gap: 5 },
  support: { fontFamily: 'Inter_400Regular', fontSize: 13, color: theme.muted, lineHeight: 20 },
  error: { color: habitColors.coral, fontFamily: 'Inter_400Regular' },
  button: {
    minHeight: 52,
    padding: 16,
    borderRadius: 13,
    backgroundColor: theme.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 16 },
  secondary: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: theme.forest, fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  archive: { alignItems: 'center', gap: 5 },
});
