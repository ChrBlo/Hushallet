import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import AvatarIcon, { Avatar } from '../../../components/get-avatar';
import SmallArrowSelectorBar from '../../../components/small-arrow-selector-bar';
import StyledButton from '../../../components/styled-button';
import TaskButton from '../../../components/task-button';
import { useHouseholdGet } from '../../../infra/hooks/use_household';
import { useSelectedHouseholdId } from '../../../providers/household_provider';

interface Task {
  id: string;
  title: string;
  description: string;
  executedBy: Avatar[];
  frequency: number;
  points: number;
}

const handleCreateNewTask = () => {
  router.push('/task-modal');
};

const handleEditTask = (task: Task) => {
  router.push({
    pathname: '/task-modal',
    params: {
      taskId: task.id,
      title: task.title,
      description: task.description,
      frequency: task.frequency.toString(),
      points: task.points.toString(),
    },
  });
};

export const TaskScreen = () => {
  const theme = useTheme();
  const s = createStyles(theme);
  const households = useHouseholdGet();
  const { selectedHouseholdId, setSelectedHouseholdId } =
    useSelectedHouseholdId();

  const selectedHousehold = households.data?.find(
    h => h.household.id === selectedHouseholdId
  );
  const tasks = selectedHousehold?.tasks || [];

  return (
    <>
      <StatusBar style="auto" />
      <SmallArrowSelectorBar
        title={'Idag'}
        onPrev={() => {}}
        onNext={() => {}}
      />
      <ScrollView contentContainerStyle={s.container}>
        {tasks.map(t => (
          <TaskButton key={t.id} title={t.title} onPress={() => {}}>
            <View style={s.row}>
              {' '}
              {/* Need avatarMap to fix showing of icon */}
              {t.completions.map((completion, index) => {
                const user = selectedHousehold?.household.users.find(
                  u => u.id === completion.household_member_id
                );
                return (
                  <AvatarIcon
                    key={completion.household_member_id}
                    avatar={'fox'}
                  />
                );
              })}
            </View>
          </TaskButton>
        ))}
      </ScrollView>
      <StyledButton
        title={'Lägg till'}
        onPress={handleCreateNewTask}
        style={[s.button, s.bottomLeft]}
      />
      <StyledButton
        title={'Ändra'}
        // TODO FIXA SÅ ATT DENNA INTE KÖR PÅ [0] UTAN DEN VERKLIGA TASK:en MAN MARKERAT
        // handleEditTask SKALL INTE HELLER LIGGA PÅ DENNA KNAPP UTAN PÅ DEN TASK-SPECIFIKA EDIT-PENNAN
        onPress={() => handleEditTask}
        style={[s.button, s.bottomRight]}
      />
    </>
  );
};

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      paddingTop: 10,
      paddingBottom: 120,
      gap: 10,
    },
    logo: {
      width: 250,
      height: 250,
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
    row: {
      flexDirection: 'row',
    },
  });

export default TaskScreen;
