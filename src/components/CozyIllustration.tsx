import { Image } from 'react-native';
export function CozyIllustration({ width = 140 }: { width?: number }) {
  return (
    <Image
      source={require('../../assets/illustrations/cozy-rabbit.png')}
      accessible={false}
      importantForAccessibility="no"
      resizeMode="contain"
      style={{ width, height: (width * 2) / 3 }}
    />
  );
}
