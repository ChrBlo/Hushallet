import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { MD3Theme, Text, useTheme } from 'react-native-paper';
import PieChart from 'react-native-pie-chart';
import SmallArrowSelectorBar from '../../../components/small-arrow-selector-bar';
import { Household } from '../../../types/household';
import { Task } from '../../../types/task';
import { useSelectedHouseholdId } from '../../../providers/household_provider';
import { useState } from 'react';
import { getAvatarConfig } from '../../../components/get-avatar';
import {
  getTimePeriods,
  isWithinPeriod,
  TimePeriod,
} from '../../../infra/helpers/statistics';
import { useHouseholdGet } from '../../../infra/hooks/use_household';

interface ChartData {
  value: number;
  color: string;
  label: {
    text: string;
    fontSize: number;
  };
}

const titleLength: number = 18;
const processChartTitle = (str: string) => {
  if (str.trim().length >= titleLength) {
    return str.slice(0, titleLength - 3).trim() + '...';
  }
  return str.trim();
};

const filterTimePeriods = (tasks: Task[] | undefined): TimePeriod[] => {
  const periods = getTimePeriods();
  if (tasks === undefined) {
    return periods;
  }
  const filtered: TimePeriod[] = [periods[0]];

  for (let i = 1; i < periods.length; i++) {
    const hasCompletions = tasks.some(t =>
      t.completions.some(c => isWithinPeriod(c.execution_date, periods[i]))
    );
    if (!hasCompletions) continue;

    filtered.push(periods[i]);
  }
  return filtered;
};

// Takes all of the tasks in the data set and sums them, dividing them into avatar and points + adds font styling
const getTotalChartData = (tasks: Task[], household: Household) => {
  const map = new Map<string, number>();
  let totalPoints = 0;
  tasks.forEach(task =>
    task.completions.forEach(completion => {
      const oldPoints = map.get(completion.household_member_id) ?? 0;
      map.set(completion.household_member_id, oldPoints + task.points);
      totalPoints += task.points;
    })
  );

  const chartData: ChartData[] = [];
  for (const key of map.keys()) {
    const avatar = getAvatarConfig(
      household.users.find(u => u.id === key)!.icon
    );
    const dataPoint = {
      value: map.get(key) ?? 0,
      color: avatar.color,
      label: { text: avatar.emoji, fontSize: 32 },
    };
    chartData.push(dataPoint);
  }

  if (chartData.length < 1) {
    chartData.push({
      value: 1,
      color: '#ccc',
      label: { text: '❔', fontSize: 160 },
    });
  }
  return chartData;
};

// Takes all of the tasks for a certain datapoint (a certain task) and divides them avatar and points + adds font styling
const getChartData = (task: Task, household: Household) => {
  const data: ChartData[] = [];
  if (task.completions.length < 1) {
    data.push({
      value: 1,
      color: '#ccc',
      label: { text: '❔', fontSize: 68 },
    });
    return data;
  }

  const map = new Map<string, number>();
  for (const e of task.completions) {
    map.set(
      e.household_member_id,
      (map.get(e.household_member_id) ?? 0) + task.points
    );
  }

  for (const key of map.keys()) {
    const avatar = getAvatarConfig(
      household.users.find(u => u.id === key)!.icon
    );
    data.push({
      value: map.get(key) ?? 0,
      color: avatar.color,
      label: { text: avatar.emoji, fontSize: 24 },
    });
  }
  return data;
};

export const StatisticsScreen = () => {
  const s = createStyles(useTheme());
  const dimensions = Dimensions.get('window');
  const households = useHouseholdGet();
  const { selectedHouseholdId } = useSelectedHouseholdId();
  const [periodIndex, setPeriodIndex] = useState<number>(0);

  const data = households.data?.find(
    h => h.household.id === selectedHouseholdId
  );

  const timePeriods: TimePeriod[] = filterTimePeriods(data?.tasks);

  const filteredTasks: Task[] = [];
  data?.tasks
    ?.filter(t => t.status === 'active')
    .forEach(t => {
      const task: Task = {
        ...t,
        completions: t.completions.filter(c =>
          isWithinPeriod(c.execution_date, timePeriods[periodIndex])
        ),
      };
      filteredTasks.push(task);
    });

  const increasePeriodIndex = () => {
    const newIndex =
      periodIndex === timePeriods.length - 1 ? 0 : periodIndex + 1;
    setPeriodIndex(newIndex);
  };

  const decreasePeriodIndex = () => {
    const newIndex =
      periodIndex === 0 ? timePeriods.length - 1 : periodIndex - 1;
    setPeriodIndex(newIndex);
  };

  return (
    <View style={[s.flex, s.container]}>
      <SmallArrowSelectorBar
        title={timePeriods[periodIndex].title}
        onNext={increasePeriodIndex}
        onPrev={decreasePeriodIndex}
      />
      {filteredTasks.length > 0 && data?.household ? (
        <ScrollView style={s.flex}>
          <PieChart
            style={s.mainChart}
            widthAndHeight={dimensions.width / 1.5}
            series={getTotalChartData(filteredTasks, data.household)}
          />
          <Text style={s.totalText}>Total</Text>
          <View style={[s.flex, s.minorChartContainer, s.center]}>
            {filteredTasks.map(t => (
              <View key={t.title} style={s.center}>
                <PieChart
                  style={s.minorChart}
                  widthAndHeight={dimensions.width / 3.5}
                  series={getChartData(t, data.household)}
                />
                <Text style={s.smText}>{processChartTitle(t.title)}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={[s.flex, s.container, s.center]}>
          <Text>
            {households.isLoading
              ? 'Hämtar data...'
              : 'Det finns ingen data att visa.'}
          </Text>
        </View>
      )}
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
      fontSize: 13,
    },
  });

export default StatisticsScreen;
