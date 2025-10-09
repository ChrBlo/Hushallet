import { ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MD3Theme, useTheme } from 'react-native-paper';
import TaskButton, { Avatar } from '../components/task-button';
import { SmallArrowSelectorBar } from '../components/small-arrow-selector-bar';
import StyledButton from '../components/styled-button';
import { Link } from 'expo-router';

interface Task {
  id: string;
  title: string;
  description: string;
  executedBy: Avatar[];
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
  },
  {
    id: 'def',
    title: 'Gå ut med Buster',
    description: 'Gå ut med hunden. OBS: Glöm inte att plocka upp bajset!!!',
    executedBy: [executers[2]],
  },
];

export const HomeScreen = () => {
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
          <TaskButton
            id={t.id}
            edit={false}
            title={t.title}
            executedBy={t.executedBy}
            onClickDefault={() => {}}
            onClickEdit={() => {}}
          />
        ))}
        <Link href={'/statistics'} style={{ padding: 12 }}>
          Link to statistics
        </Link>
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
