import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { theme } from '../../theme/tokens';
export default function TabLayout() {
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
          title: 'Today',
          tabBarIcon: ({ color }) => (
            <Text accessible={false} aria-hidden={true} style={{ color, fontSize: 24 }}>
              ⌂
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color }) => (
            <Text accessible={false} aria-hidden={true} style={{ color, fontSize: 24 }}>
              ▥
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Text accessible={false} aria-hidden={true} style={{ color, fontSize: 23 }}>
              ⚙
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
