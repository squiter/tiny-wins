import { StyleSheet, View } from 'react-native';
import { theme } from '../theme/tokens';
export function NoteMarker({ completed }: { completed: boolean }) {
  return (
    <View
      accessible={false}
      pointerEvents="none"
      style={[styles.marker, { borderColor: completed ? '#FFFFFF' : theme.forest }]}
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
