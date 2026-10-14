import { StyleSheet, Text, View } from 'react-native';
import { useTheme, useThemeStyles } from '../theme/useTheme';
import type { ThemePalette } from '../theme/tokens';
export function StatsGrid({
  items,
}: {
  items: { label: string; value: string | number; icon: string }[];
}) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles, theme);
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={styles.card}>
          <Text accessible={false} style={styles.icon}>
            {item.icon}
          </Text>
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}
const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    card: {
      width: '48%',
      flexGrow: 1,
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 16,
      gap: 6,
      borderWidth: 1,
      borderColor: theme.stone,
    },
    icon: { fontSize: 21 },
    value: { fontFamily: 'Fraunces_600SemiBold', fontSize: 29, color: theme.forest },
    label: { fontFamily: 'Inter_400Regular', fontSize: 13, color: theme.muted, lineHeight: 19 },
  });
