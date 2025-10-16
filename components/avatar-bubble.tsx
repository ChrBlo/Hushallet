import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import type { AvatarConfig } from './get-avatar';

type AvatarBubbleProps = {
  config: AvatarConfig;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

const AvatarBubble = ({ config, size = 32, style }: AvatarBubbleProps) => (
  <View
    style={[
      styles.container,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: config.color,
      },
      style,
    ]}
  >
    <Text style={[styles.emoji, { fontSize: size * 0.8 }]}>{config.emoji}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
});

export default AvatarBubble;
