import { Image, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSystemI18n } from '../features/localization/provider';
import { useSystemTheme } from '../theme/useTheme';

export function LaunchScreen({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { t } = useSystemI18n();
  const { theme, scheme } = useSystemTheme();
  return (
    <View
      testID="launch-loading"
      accessibilityRole="progressbar"
      accessibilityLabel={t('Getting your tiny wins ready…')}
      accessibilityState={{ busy: true }}
      style={[styles.screen, { backgroundColor: theme.ivory }]}
    >
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Image
        accessible={false}
        source={
          scheme === 'dark'
            ? require('../../assets/branding/mark-dark.png')
            : require('../../assets/branding/mark-light.png')
        }
        style={styles.mark}
      />
      <View style={styles.copy}>
        <Text
          maxFontSizeMultiplier={1.5}
          style={[
            styles.name,
            { color: theme.forest },
            fontsLoaded && { fontFamily: 'Fraunces_600SemiBold' },
          ]}
        >
          tiny wins
        </Text>
        <Text
          style={[
            styles.status,
            { color: theme.muted },
            fontsLoaded && { fontFamily: 'Inter_400Regular' },
          ]}
        >
          {t('Getting your tiny wins ready…')}
        </Text>
      </View>
      <Text
        style={[
          styles.encouragement,
          { color: theme.muted },
          fontsLoaded && { fontFamily: 'Fraunces_600SemiBold' },
        ]}
      >
        {t('Consistency over perfection.')}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  // Keep the mark centered exactly where the native splash places it.
  copy: {
    position: 'absolute',
    top: '50%',
    marginTop: 68,
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 20,
  },
  mark: { width: 96, height: 96 },
  name: { fontSize: 36, textAlign: 'center' },
  status: { fontSize: 14, lineHeight: 22, textAlign: 'center' },
  encouragement: {
    position: 'absolute',
    bottom: '8%',
    maxWidth: '84%',
    fontSize: 17,
    textAlign: 'center',
  },
});
