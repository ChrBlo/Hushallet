import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import type { AvatarConfig } from './get-avatar';

type AvatarBubbleProps = {
  config: AvatarConfig;
  size?: number;
  style?: StyleProp<ViewStyle>;
  number?: number;
};

const AvatarBubble = ({
  config,
  size = 32,
  style,
  number,
}: AvatarBubbleProps) => {
  const s = createStyles(size, config);

  return (
    <View
      style={[
        s.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: config.color,
        },
        style,
      ]}
    >
      <Text style={[s.emoji, { fontSize: size * 0.8 }]}>{config.emoji}</Text>
      {number && (
        <View style={s.numberContainer}>
          <Text style={s.text}>{number}</Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (size: number, config: AvatarConfig) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    emoji: {
      fontSize: 20,
    },
    numberContainer: {
      position: 'absolute',
      right: -size / 10,
      bottom: 0,
      width: size / 2,
      height: size / 2,
      backgroundColor: config.color,
      borderRadius: '100%',
    },
    text: {
      textAlign: 'center',
      color: 'white',
      fontWeight: 'bold',
      marginVertical: 'auto',
      fontSize: size * 0.4,
    },
  });

export default AvatarBubble;
