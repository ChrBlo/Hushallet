import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

interface Props {
  callback: () => void;
  symbol: string;
  size?: number;
  color?: string;
}

export const RoundButton = ({ symbol, size = 32, color, callback }: Props) => {
  const theme = useTheme();
  if (!color) {
    color = theme.dark ? 'white' : 'black';
  }
  const s = createStyles(size, color);

  return (
    <TouchableOpacity
      onPress={() => {
        callback();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }}
    >
      <View style={[s.container, s.center]}>
        <Text style={s.font}>{symbol}</Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (size: number, color: string) =>
  StyleSheet.create({
    container: {
      height: size,
      width: size,
      borderRadius: '100%',
      borderWidth: 2,
      borderColor: color,
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    font: {
      fontSize: 20,
      color: color,
      paddingBottom: size / 20,
    },
    transform: {},
  });

export default RoundButton;
