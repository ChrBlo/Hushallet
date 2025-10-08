import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { MD3Theme, Surface, useTheme } from 'react-native-paper';

interface Props {
  title: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

export const StyledButton = (props: Props) => {
  const s = createStyles(useTheme());

  return (
    <TouchableOpacity style={props.style} onPress={props.onPress}>
      <Surface style={s.container}>
        <Text style={s.text}>{props.title}</Text>
      </Surface>
    </TouchableOpacity>
  );
};

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 9999,
      margin: 8,
      outlineWidth: theme.dark ? 2 : 0,
      outlineColor: '#555',
    },
    text: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.onSurface,
    },
  });

export default StyledButton;
