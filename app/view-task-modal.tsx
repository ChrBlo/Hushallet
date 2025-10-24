import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { Task } from '../types/task';
import {
  Button,
  Divider,
  MD3Theme,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { useTaskGet } from '../infra/hooks/use_task';
import { getToday, isWithinPeriod } from '../infra/helpers/statistics';
import AvatarBubble from '../components/avatar-bubble';
import { getAvatarConfig } from '../components/get-avatar';
import { householdGet } from '../infra/household_functions';
import { useSelectedHouseholdId } from '../providers/household_provider';
import { HouseholdWithTasks } from '../types/household';
import { Icon } from '../types/household_user';
import RoundButton from '../components/round-button';
import { TaskCompletion } from '../types/task_completion';
import { auth } from '../firebase_client';
import { useTaskUpdate } from '../infra/hooks/use_task_update';
import { useTaskCompletionCreate } from '../infra/hooks/use_task_completion_create';

interface Completion {
  emoji: Icon;
  times: number;
}

const getCompletions = (task: Task, household: HouseholdWithTasks) => {
  const map = new Map<string, number>();
  task.completions.forEach(c => {
    if (!isWithinPeriod(c.execution_date, getToday())) return;
    map.set(c.household_member_id, (map.get(c.household_member_id) ?? 0) + 1);
  });

  const result: Completion[] = [];
  for (const x of map.keys()) {
    const value = map.get(x);
    const userEmoji = household.household.users.find(u => u.id === x)?.icon;

    if (!userEmoji) result.push({ emoji: 'fox', times: -1 });
    else result.push({ emoji: userEmoji, times: value! });
  }
  return result;
};

export const ViewTaskModal = () => {
  const router = useRouter();
  const theme = useTheme();
  const currentUserId = auth.currentUser?.uid;
  const params = useLocalSearchParams();
  const task = useTaskGet(params.taskId.toString());
  const s = createStyles(theme);
  const { selectedHouseholdId } = useSelectedHouseholdId();
  const [completions, setCompletions] = useState<Completion[]>([]);
  const createCompletion = useTaskCompletionCreate();

  const addCompletion = async () => {
    if (!currentUserId || !task.data?.id) return;

    const completion: TaskCompletion = {
      household_member_id: currentUserId,
      execution_date: new Date(),
    };

    createCompletion.mutate({
      taskId: task.data?.id,
      completion: {
        household_member_id: currentUserId,
        execution_date: new Date(),
      },
    });
  };

  useEffect(() => {
    const getData = async () => {
      const data = await householdGet();
      const household = data.find(h => h.household.id === selectedHouseholdId);
      if (household && task.data) {
        setCompletions(getCompletions(task.data, household));
      }
    };
    getData();
  }, [task]);

  return (
    <Animated.View entering={FadeIn.duration(200)} style={s.backdrop}>
      <BlurView
        intensity={15}
        style={StyleSheet.absoluteFill}
        tint={theme.dark ? 'dark' : 'light'}
      />

      <Animated.View
        entering={FadeInDown.duration(300).springify()}
        style={s.modalContainer}
      >
        <Surface style={s.card} elevation={5}>
          <Text style={[s.header]}>{task.data?.title}</Text>

          <ScrollView contentContainerStyle={s.scrollContent}>
            <View style={s.textSection}>
              <Text style={[s.label, s.bottomPadding]}>Beskrivning:</Text>
              <Text style={[s.bottomBorder]}>{task.data?.description}</Text>
            </View>

            <View style={[s.valueSection, s.bottomBorder]}>
              <Text style={s.label}>Intervall:</Text>
              <Text style={s.label}>{task.data?.frequency}</Text>
            </View>

            <View style={[s.valueSection, s.bottomBorder]}>
              <Text style={s.label}>Poäng:</Text>
              <Text style={s.label}>{task.data?.points}</Text>
            </View>

            <View style={[s.textSection, s.bottomBorder]}>
              <Text style={[s.label, s.bottomPadding]}>Har gjort idag:</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {completions.length > 0 ? (
                  completions?.map(c => (
                    <AvatarBubble
                      key={c.emoji.toString()}
                      config={getAvatarConfig(c.emoji)}
                      number={c.times}
                      size={48}
                    />
                  ))
                ) : (
                  <Text>Ingen</Text>
                )}
              </View>
            </View>
            <View style={[s.row, s.spaceBetween]}>
              <RoundButton
                symbol={'-'}
                color={'#982323'}
                callback={() => console.log('MINUS')}
              />
              <RoundButton
                symbol={'+'}
                color={'#2f8d2f'}
                callback={() => console.log('PLUS')}
              />
            </View>
          </ScrollView>

          <View style={s.buttonContainer}>
            <Button
              mode="text"
              onPress={() => router.back()}
              style={s.button}
              labelStyle={s.buttonLabel}
              contentStyle={s.buttonContent}
              rippleColor="transparent"
              disabled={false}
            >
              Gå Tillbaka
            </Button>
          </View>
        </Surface>
      </Animated.View>
    </Animated.View>
  );
};

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalContainer: {
      maxHeight: '85%',
      marginHorizontal: 16,
      marginVertical: 'auto',
    },
    bottomBorder: {
      borderBottomWidth: 1,
      borderColor: theme.colors.outlineVariant,
      paddingBottom: 8,
    },
    bottomPadding: {
      paddingBottom: 8,
    },
    card: {
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 15,
      backgroundColor: theme.colors.surface,
    },
    valueSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 8,
    },
    textSection: {
      marginVertical: 8,
    },
    scrollContent: {
      padding: 24,
      paddingBottom: 8,
    },
    header: {
      fontSize: 20,
      padding: 16,
      textAlign: 'center',
    },
    label: {
      fontSize: 18,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      padding: 12,
      paddingBottom: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outlineVariant,
    },
    button: {
      flex: 1,
      borderRadius: 0,
    },
    buttonContent: {
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 20,
      lineHeight: 22,
      paddingVertical: 6,
    },
    separator: {
      borderLeftWidth: 1,
      borderLeftColor: theme.colors.outlineVariant,
      height: '100%',
    },
    row: {
      flex: 1,
      flexDirection: 'row',
    },
    spaceBetween: {
      justifyContent: 'space-between',
    },
    buttonLabel: {
      color: theme.colors.onSurface,
      fontSize: 20,
    },
    inputTitle: {
      color: theme.colors.onSurfaceVariant,
      backgroundColor: theme.colors.surfaceVariant,
      marginBottom: 12,
    },
    inputDescription: {
      color: theme.colors.onSurfaceVariant,
      backgroundColor: theme.colors.surfaceVariant,
      marginBottom: 16,
    },
  });

export default ViewTaskModal;
