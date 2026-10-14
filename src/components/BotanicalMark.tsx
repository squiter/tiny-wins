import { View } from 'react-native';
import { useTheme } from '../theme/useTheme';
export function BotanicalMark() {
  const { theme } = useTheme();
  return (
    <View accessible={false} aria-hidden pointerEvents="none" style={{ width: 76, height: 54 }}>
      <View
        style={{
          position: 'absolute',
          left: 35,
          top: 17,
          width: 3,
          height: 34,
          borderRadius: 2,
          backgroundColor: theme.forest,
          transform: [{ rotate: '12deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 17,
          top: 24,
          width: 23,
          height: 15,
          borderTopLeftRadius: 16,
          borderBottomRightRadius: 16,
          borderTopRightRadius: 3,
          borderBottomLeftRadius: 3,
          backgroundColor: theme.sage,
          transform: [{ rotate: '25deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 35,
          top: 9,
          width: 24,
          height: 17,
          borderTopRightRadius: 17,
          borderBottomLeftRadius: 17,
          borderTopLeftRadius: 3,
          borderBottomRightRadius: 3,
          backgroundColor: theme.forest,
          transform: [{ rotate: '-20deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 57,
          top: 39,
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: theme.apricot,
        }}
      />
    </View>
  );
}
