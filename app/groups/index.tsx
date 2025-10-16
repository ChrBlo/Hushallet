import { router } from 'expo-router';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import StyledButton from '../../components/styled-button';
import TaskButton from '../../components/task-button';
import { useHouseholdGet } from '../../infra/hooks/use_household';
import { useSelectedHouseholdId } from '../../providers/household_provider';

const GroupsScreen = () => {
  const theme = useTheme();
  const s = createStyles(theme);
  const houseHolds = useHouseholdGet();

  const { setSelectedHouseholdId } = useSelectedHouseholdId();

  const handleButtonPress = (householdId: string) => {
    setSelectedHouseholdId(householdId);
    router.push('/groups/(tabs)');
  };

  return (
    <>
      <ScrollView contentContainerStyle={s.container}>
        {houseHolds.data?.map(h => (
          <TaskButton
            key={h.household.id}
            title={h.household.name}
            onPress={() => handleButtonPress(h.household.id!)}
          ></TaskButton>
        ))}
        <View>
          <Button title="tasks" onPress={() => router.push('/groups/(tabs)')} />
        </View>
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
