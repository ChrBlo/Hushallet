import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MD3Theme, Text, Surface, useTheme } from 'react-native-paper';

interface Props {
  id: string;
  title: string;
  edit: boolean;
  executedBy: Avatar[];
  onClickDefault: () => void;
  onClickEdit: () => void;
}

export interface Avatar {
  avatar: 'fox' | 'octopus' | 'owl';
}

export const TaskButton = (props: Props) => {
  const s = createStyles(useTheme());

  return (
    <>
      <TouchableOpacity style={s.outerContainer} onPress={props.onClickDefault}>
        <Surface style={s.container}>
          <Text style={s.text}>{props.title}</Text>
          <View style={s.row}>
            {props.executedBy?.map((p, index) => (
              <Text style={s.text}>{getAvatar(p)}</Text>
            ))}
          </View>
        </Surface>
      </TouchableOpacity>
    </>
  );
};

export default TaskButton;

const getAvatar = (avatar: Avatar) => {
  if (avatar.avatar === 'fox') {
    return '🦊';
  } else if (avatar.avatar === 'octopus') {
    return '🦑';
  } else if (avatar.avatar === 'owl') {
    return '🦉';
  }
};

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      height: 60,
      backgroundColor: theme.colors.surface,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 8,
      borderRadius: theme.roundness,
    },
    outerContainer: {
      marginHorizontal: 8,
      alignSelf: 'stretch',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    row: {
      flexDirection: 'row',
    },
    text: {
      fontSize: 18,
      fontWeight: '600',
    },
  });
