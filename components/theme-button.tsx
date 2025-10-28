import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import {
  ThemeSetting,
  useCustomTheme,
} from '../providers/custom-theme-provider';
import Feather from '@expo/vector-icons/Feather';

export const ThemeButton = () => {
  const size = 38;
  const { cycleTheme, getThemeSetting } = useCustomTheme();
  const setting = getThemeSetting();
  const theme = useTheme();
  const s = createStyles(theme, size);

  const getTextOrIcon = (setting: ThemeSetting) => {
    if (setting.setting === 'auto') {
      return <Text style={s.text}>Auto</Text>;
    } else if (setting.setting === 'light') {
      return <Feather name="sun" size={24} color={theme.colors.onSurface} />;
    } else {
      return <Feather name="moon" size={24} color={theme.colors.onSurface} />;
    }
  };

  return (
    <TouchableOpacity onPress={cycleTheme}>
      <View style={s.container}>{getTextOrIcon(setting)}</View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: MD3Theme, size: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      height: size,
      width: size,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '100%',
      marginRight: 12,
    },
    text: {
      color: theme.colors.onSurface,
      fontSize: size * 0.35,
      fontWeight: 'bold',
    },
  });

export default ThemeButton;
