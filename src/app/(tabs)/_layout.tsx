import { useI18n } from '../../features/localization/provider';
import { Tabs } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabIcon } from '../../components/TabIcon';
import { useTheme } from '../../theme/useTheme';
export default function TabLayout() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 68 + insets.bottom + Math.ceil(24 * Math.max(0, fontScale - 1));
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.forest,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          backgroundColor: theme.ivory,
          borderTopColor: theme.stone,
          minHeight: 68,
          height: tabBarHeight,
        },
        tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
        sceneStyle: { backgroundColor: theme.ivory },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('Today'),
          tabBarIcon: ({ color }) => <TabIcon name="today" color={color} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: t('Insights'),
          tabBarIcon: ({ color }) => <TabIcon name="insights" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('Settings'),
          tabBarIcon: ({ color }) => <TabIcon name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
