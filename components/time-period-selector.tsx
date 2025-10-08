import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import { Text } from 'react-native-paper';

interface Props {
  title: string;
  onNextDate: () => void;
  onPrevDate: () => void;
}

export const TimePeriodSelector = (props: Props) => {
  const s = createStyles(useTheme());
  const left = '<';
  const right = '>';

  return (
    <View style={s.container}>
      <View style={s.row}>
        <TouchableOpacity style={s.t} onPress={props.onPrevDate}>
          <Text style={s.brackets}>{left}</Text>
        </TouchableOpacity>
        <Text style={s.dateText}>{props.title}</Text>
        <TouchableOpacity style={s.t} onPress={props.onNextDate}>
          <Text style={s.brackets}>{right}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      height: 40,
      flexDirection: 'row',
      alignSelf: 'stretch',
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surfaceDisabled,
    },
    row: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      alignSelf: 'stretch',
    },
    brackets: {
      fontSize: 24,
      fontWeight: 'bold',
      marginHorizontal: 8,
    },
    dateText: {
      fontSize: 18,
      fontWeight: '600',
    },
    t: {
      height: '100%',
      justifyContent: 'center',
    },
  });

export default TimePeriodSelector;
