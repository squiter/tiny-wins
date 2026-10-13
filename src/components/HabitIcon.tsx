import { Text, View } from 'react-native';
import type { ColorKey, IconKey } from '../domain/habit';
import { habitSurfaces } from '../theme/tokens';
export const habitIcons: Record<IconKey, { glyph: string; label: string }> = {
  plant: { glyph: '🌱', label: 'Plant' },
  water: { glyph: '💧', label: 'Water' },
  book: { glyph: '📖', label: 'Book' },
  walk: { glyph: '👟', label: 'Walk' },
  stretch: { glyph: '🏋️', label: 'Stretch' },
  sun: { glyph: '☀️', label: 'Sun' },
  moon: { glyph: '🌙', label: 'Moon' },
  heart: { glyph: '💚', label: 'Heart' },
  coffee: { glyph: '☕', label: 'Coffee' },
  study: { glyph: '🎓', label: 'Study' },
  music: { glyph: '🎵', label: 'Music' },
  smile: { glyph: '🙂', label: 'Smile' },
};
export function HabitIcon({ icon, color }: { icon: IconKey; color: ColorKey }) {
  return (
    <View
      accessible={false}
      style={{
        width: 44,
        height: 44,
        borderRadius: 13,
        backgroundColor: habitSurfaces[color],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text accessible={false} maxFontSizeMultiplier={1} style={{ fontSize: 25 }}>
        {habitIcons[icon].glyph}
      </Text>
    </View>
  );
}
