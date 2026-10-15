import { useI18n } from '../../features/localization/provider';
import { Tabs } from 'expo-router';
import { TabIcon } from '../../components/TabIcon';
import { useTheme } from '../../theme/useTheme';
export default function TabLayout() {
  const { t } = useI18n();
  const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.forest,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: { backgroundColor: theme.ivory, borderTopColor: theme.stone, minHeight: 68 },
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
