import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import AvatarIcon, { Avatar } from '../../../components/get-avatar';
import SmallArrowSelectorBar from '../../../components/small-arrow-selector-bar';
import StyledButton from '../../../components/styled-button';
import TaskButton from '../../../components/task-button';

interface Task {
  id: string;
  title: string;
  description: string;
  executedBy: Avatar[];
  frequency: number;
  points: number;
}

const executers: Avatar[] = [
  { avatar: 'fox' },
  { avatar: 'octopus' },
  { avatar: 'owl' },
];

const tasks: Task[] = [
  {
    id: 'abc',
    title: 'Städa sönder i köket',
    description: 'Städa upp all gammal mat, skura golv, städa ut kylskåp',
    executedBy: [executers[0], executers[1]],
    frequency: 14,
    points: 8,
  },
  {
    id: 'def',
    title: 'Gå ut med Buster',
    description: 'Gå ut med hunden. OBS: Glöm inte att plocka upp bajset!!!',
    executedBy: [executers[2]],
    frequency: 1,
    points: 2,
  },
];

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
              {t.executedBy.map((avatar, index) => (
                <AvatarIcon key={index} avatar={avatar.avatar} />
              ))}
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
        onPress={() => handleEditTask(tasks[0])}
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
