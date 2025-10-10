import { Dimensions, View, StyleSheet, ScrollView } from 'react-native';
import { MD3Theme, Text, useTheme } from 'react-native-paper';
import SmallArrowSelectorBar from '../../../components/small-arrow-selector-bar';
import PieChart from 'react-native-pie-chart';
import { HouseholdWithTasks } from '../../../types/household';
import { Task } from '../../../types/task';
import { HouseholdUser } from '../../../types/household_user';

interface ChartData {
  value: number;
  color: string;
  label: {
    text: string;
    fontSize: number;
  };
}

const mockUser1: HouseholdUser = {
  id: '000',
  nickname: 'Adde',
  role: 'admin',
  icon: 'octopus',
  points: 0,
  status: 'active',
};

const mockUser2: HouseholdUser = {
  id: '001',
  nickname: 'Baddie',
  role: 'member',
  icon: 'frog',
  points: 0,
  status: 'active',
};

const mockHousehold: HouseholdWithTasks = {
  household: {
    created_by: 'Adolf',
    id: '420blazeit',
    invitation_code: 'smok_til_i_die',
    name: 'Smokerz',
    users: [mockUser1, mockUser2],
  },
  tasks: [
    {
      created_by: 'Adde',
      household_id: '420blazeit',
      title: 'Städa i köket',
      description: 'Städa bara',
      created_date: new Date(),
      execution_date: null,
      frequency: 0,
      points: 4,
      status: 'active',
      users: [
        {
          user: mockUser1,
          points: 4,
          isDone: true,
        },
        {
          user: mockUser2,
          points: 8,
          isDone: true,
        },
      ],
    },
    {
      created_by: 'Adde',
      household_id: '420blazeit',
      title: 'Gå ut med Buster',
      description: 'Låt han inte bajsa i brevlådan',
      created_date: new Date(),
      execution_date: null,
      frequency: 0,
      points: 2,
      status: 'active',
      users: [
        {
          user: mockUser1,
          points: 10,
          isDone: true,
        },
      ],
    },
  ],
};

// Swap for complete function in other issue
const getAvatar = (avatar: string) => {
  console.log('getColor() - avatar: ' + avatar);

  if (avatar === 'octopus') {
    return { color: '#b232ff', icon: '🦑' };
  } else if (avatar === 'frog') {
    return { color: '#60ff3c', icon: '🐸' };
  } else {
    return { color: '#ff9100', icon: '🤔' };
  }
};

// Takes all of the tasks in the data set and sums them, dividing them into avatar and points + adds font styling
const getTotalChartData = (tasks: Task[]) => {
  const map = new Map<string, number>();
  tasks.forEach(t =>
    t.users.forEach(u => {
      const oldPoints = map.get(u.user.icon) ?? 0;
      map.set(u.user.icon, oldPoints + u.points);
    })
  );

  const chartData: ChartData[] = [];
  for (const key of map.keys()) {
    const avatar = getAvatar(key);
    const dataPoint = {
      value: map.get(key) ?? 0,
      color: avatar.color,
      label: { text: avatar.icon, fontSize: 32 },
    };
    chartData.push(dataPoint);
  }
  return chartData;
};

// Takes all of the tasks for a certain datapoint (a certain task) and divides them avatar and points + adds font styling
const getChartData = (task: Task) => {
  const data: ChartData[] = [];
  for (const e of task.users) {
    const avatar = getAvatar(e.user.icon.toString());
    data.push({
      value: e.points,
      color: avatar.color,
      label: { text: avatar.icon, fontSize: 24 },
    });
  }
  return data;
};

export const StatisticsScreen = () => {
  const s = createStyles(useTheme());
  const dimensions = Dimensions.get('window');

  // Swap for real data once it's available
  const data = mockHousehold;

  return (
    <View style={[s.flex, s.container]}>
      <SmallArrowSelectorBar
        title={'Your period here'}
        onNext={() => {}}
        onPrev={() => {}}
      />
      <ScrollView style={s.flex}>
        <PieChart
          style={s.mainChart}
          widthAndHeight={dimensions.width / 1.5}
          series={getTotalChartData(data.tasks)}
        />
        <Text style={s.totalText}>Total</Text>
        <View style={[s.flex, s.minorChartContainer, s.center]}>
          {data.tasks.map(t => (
            <View key={t.title} style={s.center}>
              <PieChart
                style={s.minorChart}
                widthAndHeight={dimensions.width / 3.5}
                series={getChartData(t)}
              />
              <Text style={s.smText}>{t.title}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    flex: {
      flex: 1,
    },
    minorChartContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    mainChart: {
      marginHorizontal: 'auto',
      marginTop: 16,
      marginBottom: 8,
    },
    minorChart: {
      margin: 8,
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    totalText: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 24,
    },
    smText: {
      fontWeight: 'bold',
      color: theme.colors.onBackground,
    },
  });

export default StatisticsScreen;
