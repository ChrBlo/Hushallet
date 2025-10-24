import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

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
  const fraction = size / 16;

  return (
    <View style={[s.container, s.center]}>
      <TouchableOpacity onPress={callback}>
        <Text
          style={[
            s.font,
            { transform: [{ scale: fraction }, { translateY: -1.5 }] },
          ]}
        >
          {symbol}
        </Text>
      </TouchableOpacity>
    </View>
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
    },
  });

export default RoundButton;
