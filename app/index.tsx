import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import StyledButton from '../components/styled-button';
import TaskButton, { Avatar } from '../components/task-button';
import TimePeriodSelector from '../components/time-period-selector';

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
    }
});
};

export const HomeScreen = () => {
  const theme = useTheme();
  const s = createStyles(theme);

  return (
    <>
      <StatusBar style="auto" />
      <TimePeriodSelector
        title={'Idag'}
        onPrevDate={() => {}}
        onNextDate={() => {}}
      />
      <ScrollView contentContainerStyle={s.container}>
        {tasks.map(t => (
          <TaskButton
            id={t.id}
            edit={false}
            title={t.title}
            executedBy={t.executedBy}
            onClickDefault={() => {}}
            onClickEdit={() => {}}
          />
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
    text: {
      color: theme.colors.onBackground,
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

export default HomeScreen;
