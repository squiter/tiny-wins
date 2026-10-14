import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';
export default function TabLayout() {
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
            <View
              accessible={false}
              aria-hidden={true}
              style={{
                width: 24,
                height: 24,
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: 3,
                paddingBottom: 3,
              }}
            >
              {[8, 14, 20].map((height) => (
                <View
                  key={height}
                  style={{
                    width: 5,
                    height,
                    borderRadius: 1,
                    borderWidth: 1.5,
                    borderColor: color,
                  }}
                />
              ))}
            </View>
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
