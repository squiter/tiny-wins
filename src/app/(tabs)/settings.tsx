import { router } from 'expo-router';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deviceClock } from '../../lib/clock';
import { BackupControls } from '../../components/BackupControls';
import { theme } from '../../theme/tokens';
export default function Settings() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text accessibilityRole="header" style={styles.heading}>
          Settings
        </Text>
        <View style={styles.card}>
          <Text style={styles.title}>Your habits stay with you</Text>
          <Text style={styles.copy}>
            {Platform.OS === 'web'
              ? 'This preview stores your wins in this browser. Keep one Tiny Wins tab open at a time.'
              : 'Your habits and wins are stored on this device.'}
          </Text>
          <Text style={styles.copy}>
            Tiny Wins does not send your habit data to a server. Use a backup file when moving
            devices.
          </Text>
        </View>
        <BackupControls />
        <View style={styles.card}>
          <Text style={styles.title}>Your local calendar</Text>
          <Text style={styles.copy}>{deviceClock.timezone()}</Text>
          <Text style={styles.copy}>
            A win belongs to the calendar date you completed it on. Travel does not move your past
            wins.
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push({ pathname: '/', params: { archived: '1' } })}
          style={styles.card}
        >
          <Text style={styles.title}>Archived habits →</Text>
          <Text style={styles.copy}>Take a break and come back when you’re ready.</Text>
        </Pressable>
        <Pressable
          accessibilityRole="link"
          onPress={() => void Linking.openURL('https://github.com/squiter/tiny-wins')}
          style={styles.card}
        >
          <Text style={styles.title}>View the project on GitHub ↗</Text>
          <Text style={styles.copy}>Tiny Wins · 0.1.0</Text>
        </Pressable>
        <Text style={styles.footer}>Small steps. Big changes.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.ivory },
  page: { padding: 16, gap: 16, width: '100%', maxWidth: 600, alignSelf: 'center' },
  heading: { fontFamily: 'Fraunces_600SemiBold', fontSize: 34, color: theme.forest, marginTop: 16 },
  card: {
    padding: 18,
    gap: 10,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.stone,
    minHeight: 48,
  },
  title: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: theme.forest },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: theme.muted },
  footer: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 21,
    color: theme.forest,
    textAlign: 'center',
    marginVertical: 20,
  },
});
