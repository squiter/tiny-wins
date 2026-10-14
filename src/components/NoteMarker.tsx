import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/useTheme';
export function NoteMarker({ completed }: { completed: boolean }) {
  const { theme } = useTheme();
  return (
    <View
      accessible={false}
      pointerEvents="none"
      style={[styles.marker, { borderColor: completed ? theme.onHabit : theme.forest }]}
    />
  );
}
const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    right: 1,
    top: 1,
    width: 4,
    height: 4,
    borderTopWidth: 1,
    borderRightWidth: 1,
  },
});
