import { Dimensions, View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import SmallArrowSelectorBar from '../components/small-arrow-selector-bar';
import PieChart from 'react-native-pie-chart';
import { Avatar } from '../components/task-button';

interface TaskData {
  name: string;
  executor: {
    avatar: Avatar;
    points: number;
  }[];
}

interface DataSet {
  period: string;
  tasks: TaskData[];
}

const data: DataSet = {
  period: 'Last Week',
  tasks: [
    {
      name: 'Clean Kitchen',
      executor: [
        {
          avatar: { avatar: 'fox' },
          points: 12,
        },
        {
          avatar: { avatar: 'owl' },
          points: 6,
        },
        {
          avatar: { avatar: 'octopus' },
          points: 4,
        },
      ],
    },
    {
      name: 'Walk Buster',
      executor: [
        {
          avatar: { avatar: 'owl' },
          points: 8,
        },
        {
          avatar: { avatar: 'octopus' },
          points: 20,
        },
      ],
    },
  ],
};

const getColor = (avatar: string) => {
  if (avatar === 'fox') {
    return '#fbd203';
  } else if (avatar === 'owl') {
    return '#53be3b';
  } else {
    return '#ff9100';
  }
};

// Takes all of the tasks in the data set and sums them, dividing them into avatar and points
const getTotalChartData = (data: DataSet) => {
  const avatars = new Set<string>();
  const map = new Map<string, number>();
  data.tasks.forEach(t =>
    t.executor.forEach(d => {
      const id = d.avatar.avatar;
      avatars.add(id);

      const oldPoints = map.get(id) ?? 0;
      map.set(id, oldPoints + d.points);
    })
  );

  const chartData: { value: number; color: string }[] = [];
  for (const key of map.keys()) {
    const dataPoint = { value: map.get(key) ?? 0, color: getColor(key) };
    chartData.push(dataPoint);
  }
  return chartData;
};

// Takes all of the tasks for a certain datapoint (a certain task) and divides them avatar and points
const getChartData = (task: TaskData) => {
  const data: { value: number; color: string }[] = [];
  for (const e of task.executor) {
    data.push({ value: e.points, color: getColor(e.avatar.avatar) });
  }
  return data;
};

export const StatisticsScreen = () => {
  const dimensions = Dimensions.get('window');

  return (
    <View style={s.flex}>
      <SmallArrowSelectorBar
        title={'Your period here'}
        onNext={() => {}}
        onPrev={() => {}}
      />
      <ScrollView style={s.flex}>
        <PieChart
          style={s.mainChart}
          widthAndHeight={dimensions.width / 1.5}
          series={getTotalChartData(data)}
        />
        <Text style={s.totalText}>Total</Text>
        <View style={[s.flex, s.minorChartContainer, s.center]}>
          {data.tasks.map((d, i) => (
              <View key={d.name} style={s.center}>
                <PieChart
                  style={s.minorChart}
                  widthAndHeight={dimensions.width / 3.5}
                  series={getChartData(d)}
                />
                <Text style={s.smText}>{d.name}</Text>
              </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
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
  },
});

export default StatisticsScreen;
