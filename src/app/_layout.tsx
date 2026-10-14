import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces/600SemiBold';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Platform, Pressable, Text, View } from 'react-native';
import { DatabaseProvider } from '../database/provider';
import { useSystemTheme, useTheme } from '../theme/useTheme';
import { recoverApp } from '../lib/recover';
export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  const { theme } = useSystemTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.ivory,
        padding: 24,
        justifyContent: 'center',
        gap: 20,
      }}
    >
      <Text accessibilityRole="header" style={{ fontSize: 26, color: theme.forest }}>
        Could not open your habits
      </Text>
      <Text style={{ color: theme.charcoal, fontSize: 16, lineHeight: 24 }}>
        {Platform.OS === 'web'
          ? 'Close any other Tiny Wins tabs and try again.'
          : 'Please try again. If this continues, close and reopen Tiny Wins.'}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => recoverApp(retry)}
        style={{
          backgroundColor: theme.forest,
          borderRadius: 16,
          padding: 18,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: theme.onPrimary, fontSize: 16 }}>Try again</Text>
      </Pressable>
    </View>
  );
}
export default function Layout() {
  const { theme } = useSystemTheme();
  const [loaded, error] = useFonts({ Fraunces_600SemiBold, Inter_400Regular, Inter_600SemiBold });
  if (!loaded && !error)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.ivory,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: theme.charcoal }}>Getting your tiny wins ready…</Text>
      </View>
    );
  return (
    <DatabaseProvider>
      <ThemedRoutes />
    </DatabaseProvider>
  );
}

function ThemedRoutes() {
  const { theme, scheme } = useTheme();
  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.ivory } }}
      />
    </>
  );
}
