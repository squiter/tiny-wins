import { StyleSheet, Text, View } from 'react-native';
import { useTheme, useThemeStyles } from '../theme/useTheme';
import type { ThemePalette } from '../theme/tokens';
import { CozyIllustration } from './CozyIllustration';
export function CozyNote({ message }: { message: string }) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles, theme);
  return (
    <View style={styles.card}>
      <CozyIllustration width={126} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    card: {
      alignItems: 'center',
      gap: 8,
      padding: 20,
      borderRadius: 24,
      backgroundColor: theme.progress,
      marginTop: 16,
    },
    text: {
      fontFamily: 'Fraunces_600SemiBold',
      fontSize: 20,
      lineHeight: 28,
      color: theme.forest,
      textAlign: 'center',
    },
  });
