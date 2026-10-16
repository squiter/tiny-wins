import { LocalizationProvider, useSystemI18n } from '../features/localization/provider';
import { FeedbackProvider } from '../features/feedback/provider';
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
import { useCallback, useEffect, useState } from 'react';
import { LaunchScreen } from '../components/LaunchScreen';
import { hideNativeSplash } from '../lib/splash';
export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  const { t } = useSystemI18n();
  const { theme, scheme } = useSystemTheme();
  return (
    <View
      onLayout={hideNativeSplash}
      style={{
        flex: 1,
        backgroundColor: theme.ivory,
        padding: 24,
        justifyContent: 'center',
        gap: 20,
      }}
    >
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Text accessibilityRole="header" style={{ fontSize: 26, color: theme.forest }}>
        {t('Could not open your habits')}
      </Text>
      <Text style={{ color: theme.charcoal, fontSize: 16, lineHeight: 24 }}>
        {Platform.OS === 'web'
          ? t('Close any other Tiny Wins tabs and try again.')
          : t('Please try again. If this continues, close and reopen Tiny Wins.')}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => recoverApp(retry)}
        style={{
          backgroundColor: theme.forest,
          borderRadius: 20,
          padding: 18,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: theme.onPrimary, fontSize: 16 }}>{t('Try again')}</Text>
      </Pressable>
    </View>
  );
}
export default function Layout() {
  const { theme } = useSystemTheme();
  const [loaded, error] = useFonts({ Fraunces_600SemiBold, Inter_400Regular, Inter_600SemiBold });
  const [ready, setReady] = useState(false);
  const [surfaceLaidOut, setSurfaceLaidOut] = useState(false);
  const onAppReady = useCallback(() => setReady(true), []);
  const onSurfaceLayout = useCallback(() => setSurfaceLaidOut(true), []);
  useEffect(() => {
    if (loaded && surfaceLaidOut) hideNativeSplash();
  }, [loaded, surfaceLaidOut]);
  if (error) throw error;
  return (
    <View style={{ flex: 1, backgroundColor: theme.ivory }} onLayout={onSurfaceLayout}>
      {loaded && (
        <DatabaseProvider>
          <LocalizationProvider>
            <FeedbackProvider>
              <ThemedRoutes onReady={onAppReady} />
            </FeedbackProvider>
          </LocalizationProvider>
        </DatabaseProvider>
      )}
      {!ready && <LaunchScreen fontsLoaded={loaded} />}
    </View>
  );
}

function ThemedRoutes({ onReady }: { onReady(): void }) {
  const { theme, scheme } = useTheme();
  const [laidOut, setLaidOut] = useState(false);
  const finishLayout = useCallback(() => {
    setLaidOut(true);
    onReady();
  }, [onReady]);
  return (
    <View
      style={{ flex: 1, backgroundColor: theme.ivory }}
      onLayout={finishLayout}
      accessibilityElementsHidden={!laidOut}
      importantForAccessibility={laidOut ? 'auto' : 'no-hide-descendants'}
    >
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.ivory } }}
      />
    </View>
  );
}
