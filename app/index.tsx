import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import SmallArrowSelectorBar from '../components/small-arrow-selector-bar';
import AvatarIcon, { Avatar } from '../components/getAvatar';
import StyledButton from '../components/styled-button';
import TaskButton from '../components/task-button';
import TimePeriodSelector from '../components/time-period-selector';

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
          <TaskButton key={t.id} onPress={() => {}}>
            <Text style={s.text}>{t.title}</Text>
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
    row: {
      flexDirection: 'row',
    },
  });

export default HomeScreen;
