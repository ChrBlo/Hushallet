import { ScrollView, StyleSheet, Text } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import StyledButton from '../../components/styled-button';
import TaskButton from '../../components/task-button';

interface Household {
  id: string;
  name: string;
}

//Temp data
const houseHolds: Household[] = [
  {
    id: '001',
    name: 'Familjen Annorlunda',
  },
  {
    id: '002',
    name: 'Bastun',
  },
];

const GroupsScreen = () => {
  const theme = useTheme();
  const s = createStyles(theme);

  return (
    <>
      <ScrollView contentContainerStyle={s.container}>
        {houseHolds.map(h => (
          <TaskButton key={h.id} onPress={() => {}}>
            <Text style={s.text}>{h.name}</Text>
          </TaskButton>
        ))}
      </ScrollView>
      <StyledButton
        title={'Lägg till'}
        onPress={() => {}}
        style={[s.button, s.bottomLeft]}
      />
      <StyledButton
        title={'Ändra'}
        onPress={() => {}}
        style={[s.button, s.bottomRight]}
      />
    </>
  );
};

export default GroupsScreen;
const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      paddingTop: 10,
      paddingBottom: 120,
      gap: 10,
    },
    text: {
      fontSize: 18,
      fontWeight: '600',
    },
    bottomRight: {
      position: 'absolute',
      bottom: 30,
      right: 0,
    },
    bottomLeft: {
      position: 'absolute',
      bottom: 30,
      left: 0,
    },
    button: {
      width: '42%',
    },
  });
