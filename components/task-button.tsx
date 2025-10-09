import { StyleSheet, TouchableOpacity } from 'react-native';
import { MD3Theme, Surface, useTheme } from 'react-native-paper';

//Lämnar pga osäker på två onclick?

/* interface Props {
  id: string;
  title: string;
  edit: boolean;
  executedBy: Avatar[];
  onClickDefault: () => void;
  onClickEdit: () => void;
} */

interface Props {
  onPress: () => void;
  children: React.ReactNode;
}

export const TaskButton = ({ onPress, children }: Props) => {
  const s = createStyles(useTheme());

  return (
    <>
      <TouchableOpacity style={s.outerContainer} onPress={onPress}>
        <Surface style={s.container}>{children}</Surface>
      </TouchableOpacity>
    </>
  );
};

export default TaskButton;

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
  });
