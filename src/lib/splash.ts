import { AccessibilityInfo } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Start before the first React render; native launch stays visible during font setup.
void SplashScreen.preventAutoHideAsync().catch(() => undefined);
const reducedMotion = AccessibilityInfo.isReduceMotionEnabled().catch(() => true);

export function hideNativeSplash() {
  void reducedMotion.then((reduceMotion) => {
    SplashScreen.setOptions({ fade: !reduceMotion, duration: reduceMotion ? 0 : 180 });
    SplashScreen.hide();
  });
}
