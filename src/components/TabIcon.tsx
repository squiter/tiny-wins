import { useTheme } from '../theme/useTheme';
import { View, type ColorValue } from 'react-native';
export function TabIcon({
  name,
  color,
}: {
  name: 'today' | 'insights' | 'settings';
  color: ColorValue;
}) {
  const { theme } = useTheme();
  return (
    <View
      accessible={false}
      aria-hidden
      pointerEvents="none"
      style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}
    >
      {name === 'insights' ? (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 20 }}>
          {[8, 14, 20].map((height) => (
            <View
              key={height}
              style={{ width: 5, height, borderRadius: 2, backgroundColor: color }}
            />
          ))}
        </View>
      ) : name === 'today' ? (
        <>
          <View
            style={{
              position: 'absolute',
              top: 3,
              width: 15,
              height: 15,
              borderTopWidth: 2,
              borderLeftWidth: 2,
              borderColor: color,
              transform: [{ rotate: '45deg' }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 9,
              width: 16,
              height: 13,
              borderWidth: 2,
              borderTopWidth: 0,
              borderBottomLeftRadius: 3,
              borderBottomRightRadius: 3,
              borderColor: color,
            }}
          />
        </>
      ) : (
        <>
          {Array.from({ length: 8 }, (_, index) => (
            <View
              key={index}
              style={{
                position: 'absolute',
                width: 3,
                height: 22,
                borderRadius: 2,
                backgroundColor: color,
                transform: [{ rotate: `${index * 45}deg` }],
              }}
            />
          ))}
          <View style={{ width: 17, height: 17, borderRadius: 9, backgroundColor: color }} />
          <View
            style={{
              position: 'absolute',
              width: 5,
              height: 5,
              borderRadius: 3,
              borderWidth: 1.5,
              borderColor: color,
              backgroundColor: theme.ivory,
            }}
          />
        </>
      )}
    </View>
  );
}
