import { router } from 'expo-router';
import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import GenerateAccessCode from '../../components/generate-access-code';
import StyledButton from '../../components/styled-button';
import TaskButton from '../../components/task-button';
import { useHouseholdGet } from '../../infra/hooks/use_household';
import { useSelectedHouseholdId } from '../../providers/household_provider';

const GroupsScreen = () => {
  const theme = useTheme();
  const s = createStyles(theme);

  const houseHolds = useHouseholdGet();
  const { setSelectedHouseholdId } = useSelectedHouseholdId();
  //Temporarly placed here until create houshold is created
  const [accessCode, setAccessCode] = useState('');

  const handleButtonPress = (householdId: string) => {
    setSelectedHouseholdId(householdId);
    router.push('/groups/(tabs)');
  };

  //Temporarly placed here until create houshold is created
  const handleGenerateCode = () => {
    const code = GenerateAccessCode();
    setAccessCode(code);
  };

  return (
    <>
      <ScrollView style={s.scrollView} contentContainerStyle={s.container}>
        {houseHolds.data?.map(h => (
          <TaskButton
            key={h.household.id}
            title={h.household.name}
            onPress={() => handleButtonPress(h.household.id!)}
          >
            <View>
              <Text style={s.text}>{accessCode || 'Press button'}</Text>
            </View>
          </TaskButton>
        ))}
        <View>
          <Button title="tasks" onPress={() => router.push('/groups/(tabs)')} />
        </View>

        {/* Temporarly placed here until create houshold is created */}
        <View>
          <Button title="Generate Access Code" onPress={handleGenerateCode} />
        </View>
        {/* Ends here */}
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
      paddingTop: 10,
      gap: 10,
    },
    scrollView: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    text: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.onPrimaryContainer,
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
