import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, MD3Theme, useTheme } from 'react-native-paper';
import AvatarBubble from '../../../components/avatar-bubble';
import { getAvatarConfig } from '../../../components/get-avatar';
import StyledButton from '../../../components/styled-button';
import TaskButton from '../../../components/task-button';
import { useHouseholdGet } from '../../../infra/hooks/use_household';
import { useTaskDelete } from '../../../infra/hooks/use_task_delete';
import { useSelectedHouseholdId } from '../../../providers/household_provider';
import type { Task } from '../../../types/task';

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
      household_id: task.household_id,
      created_by: task.created_by,
      created_date: task.created_date.toISOString(),
      status: task.status,
      users: JSON.stringify(task.completions),
    },
  });
};

export const TaskScreen = () => {
  const theme = useTheme();
  const s = createStyles(theme);
  const households = useHouseholdGet();
  const { selectedHouseholdId } = useSelectedHouseholdId();
  const [isEditMode, setIsEditMode] = useState(false);
  const deleteMutation = useTaskDelete();
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const selectedHousehold = households.data?.find(
    h => h.household.id === selectedHouseholdId
  );
  const tasks = selectedHousehold?.tasks || [];

  const handleDeleteTask = async (task: Task) => {
    if (!task.id) return;

    Alert.alert(
      'Ta bort syssla',
      `Är du säker på att du vill ta bort "${task.title}"?`,
      [
        {
          text: 'Nej',
          style: 'cancel',
        },
        {
          text: 'Ja',
          style: 'destructive',
          onPress: async () => {
            setDeletingTaskId(task.id!);
            await Promise.all([
              deleteMutation.mutateAsync(task.id!),
              new Promise(resolve => setTimeout(resolve, 400)),
            ]);
            setDeletingTaskId(null);
          },
        },
      ]
    );
  };

  return (
    <>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={s.container}>
        {tasks.map(t => (
          <TaskButton
            key={t.id}
            title={t.title}
            onPress={() => {
              handleEditTask(t);
            }}
          >
            <View style={s.row}>
              {isEditMode ? (
                <>
                  <Button
                    mode="text"
                    onPress={() => handleEditTask(t)}
                    disabled={deletingTaskId === t.id}
                    compact
                    contentStyle={s.iconButtonContent}
                    style={s.iconButton}
                  >
                    <Feather
                      name="edit-3"
                      size={21}
                      color={theme.colors.onSurface}
                    />
                  </Button>

                  <Button
                    mode="text"
                    onPress={() => handleDeleteTask(t)}
                    disabled={deletingTaskId === t.id}
                    loading={deletingTaskId === t.id}
                    compact
                    contentStyle={s.iconButtonContent}
                    style={s.iconButton}
                  >
                    {deletingTaskId !== t.id && (
                      <Feather name="trash-2" size={21} color="#D32F2F" />
                    )}
                  </Button>
                </>
              ) : (
                t.completions.map((completion, index) => {
                  const user = selectedHousehold?.household.users.find(
                    u => u.id === completion.household_member_id
                  );

                  if (!user) {
                    return null;
                  }

                  return (
                    <AvatarBubble
                      key={`${completion.household_member_id}-${index}`}
                      config={getAvatarConfig(user.icon)}
                      size={28}
                      style={s.avatarBubble}
                    />
                  );
                })
              )}
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
        title={isEditMode ? 'Klar' : 'Ändra'}
        onPress={() => setIsEditMode(!isEditMode)}
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
    avatarBubble: {
      marginLeft: 4,
    },
    iconButton: {
      marginRight: -8,
      marginVertical: 0,
    },
    iconButtonContent: {
      marginHorizontal: 0,
      marginVertical: 0,
      paddingHorizontal: 4,
      paddingVertical: 4,
    },
  });

export default TaskScreen;
