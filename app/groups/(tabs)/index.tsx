import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import AvatarBubble from '../../../components/avatar-bubble';
import { getAvatarConfig } from '../../../components/get-avatar';
import SmallArrowSelectorBar from '../../../components/small-arrow-selector-bar';
import StyledButton from '../../../components/styled-button';
import TaskButton from '../../../components/task-button';
import { useHouseholdGet } from '../../../infra/hooks/use_household';
import { useSelectedHouseholdId } from '../../../providers/household_provider';
import type { Task } from '../../../types/task';
import Feather from '@expo/vector-icons/Feather';

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
          <TaskButton key={t.id} title={t.title} onPress={() => {handleEditTask(t)}}>
            <View style={s.row}>
              {isEditMode ? (
                <>
                  <TouchableOpacity onPress={() => handleEditTask(t)} style={s.iconButton} hitSlop={8}>
                    <Feather name="edit-3" size={24} color={theme.colors.onSurface} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {}} style={s.iconButton} hitSlop={8}>
                    <Feather name="trash-2" size={24} color="#D32F2F" />
                  </TouchableOpacity>
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
      marginLeft: 8,
      padding: 4,
    },
  });

export default TaskScreen;