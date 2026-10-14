import { StyleSheet, Text, View } from 'react-native';
import { useTheme, useThemeStyles } from '../theme/useTheme';
import type { ThemePalette } from '../theme/tokens';
export function CozyNote({ message }: { message: string }) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles, theme);
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    footer: {
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 28,
      paddingBottom: 16,
    },
    text: {
      fontFamily: 'Fraunces_600SemiBold',
      fontSize: 17,
      lineHeight: 25,
      color: theme.muted,
      textAlign: 'center',
    },
  });
