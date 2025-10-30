import { View, Text, StyleSheet } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import AvatarBubble from './avatar-bubble';
import { getAvatarConfig } from './get-avatar';
import type { Icon } from '../types/household_user';

interface Props {
  totalCompletions: number;
  firstIcon: Icon | undefined;
  secondIcon: Icon | undefined;
  thirdIcon: Icon | undefined;
}

export const MultipleCompletionsSymbol = (props: Props) => {
  if (!props.firstIcon || !props.secondIcon || !props.thirdIcon) {
    return <></>;
  }

  const smallerText = props.totalCompletions > 9;
  const text = smallerText ? '9+' : props.totalCompletions;
  const middleAvatar = getAvatarConfig(props.firstIcon);
  const s = createStyles(useTheme(), middleAvatar.color, smallerText);
  return (
    <View style={[s.container]}>
      <AvatarBubble style={s.left} config={getAvatarConfig(props.thirdIcon)} />
      <AvatarBubble
        style={s.right}
        config={getAvatarConfig(props.secondIcon)}
      />
      <AvatarBubble style={s.middle} config={middleAvatar} />
      <View style={[s.smallContainer, s.justifyCenter]}>
        <Text style={s.text}>{text}</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: MD3Theme, color: string, smallText: boolean) =>
  StyleSheet.create({
    container: {
      width: 60,
      height: 32,
    },
    smallContainer: {
      height: 20,
      width: 20,
      backgroundColor: color,
      borderRadius: '100%',
      position: 'absolute',
      bottom: -4,
      left: 32,
      overflow: 'hidden',
    },
    left: {
      position: 'absolute',
      transform: [{ scale: 0.8 }],
      opacity: 0.7,
    },
    middle: {
      position: 'absolute',
      left: 15,
    },
    right: {
      position: 'absolute',
      left: 30,
      transform: [{ scale: 0.8 }],
      opacity: 0.7,
    },
    text: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: smallText ? 13 : 16,
    },
    justifyCenter: {
      justifyContent: 'center',
    },
  });

export default MultipleCompletionsSymbol;
