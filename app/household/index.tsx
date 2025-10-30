import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import StyledButton from '../../components/styled-button';
import TaskButton from '../../components/task-button';
import { requireCurrentUser } from '../../infra/auth_functions';
import { useHouseholdGet } from '../../infra/hooks/use_household';
import { useSelectedHouseholdId } from '../../providers/household_provider';
import MultipleCompletionsSymbol from '../../components/multiple-completions-symbol';

const GroupsScreen = () => {
  const theme = useTheme();
  const s = createStyles(theme);

  const { data, refetch } = useHouseholdGet();
  const { setSelectedHouseholdId } = useSelectedHouseholdId();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const currentUser = requireCurrentUser();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [refetch]);

  const handleButtonPress = (householdId: string) => {
    setSelectedHouseholdId(householdId);
    router.push('/household/(tabs)');
  };

  const getUserStatus = (householdId: string) => {
    const household = data?.find(h => h.household.id === householdId);
    const user = household?.household.users.find(u => u.id === currentUser.uid);
    return user?.status;
  };

  return (
    <>
      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {data?.map(h => {
          const userStatus = getUserStatus(h.household.id!);
          const isDisabled = userStatus === 'requested';

          return (
            <TaskButton
              key={h.household.id}
              title={h.household.name}
              onPress={() => handleButtonPress(h.household.id!)}
              disabled={isDisabled}
            />
          );
        })}
      </ScrollView>

      <StyledButton
        title={'Lägg till'}
        onPress={() => {
          router.push('household-modal');
        }}
        style={s.button}
      />
    </>
  );
};

export default GroupsScreen;

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      paddingTop: 10,
      gap: 10,
    },
    scrollView: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    text: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.onPrimaryContainer,
    },
    button: {
      width: '100%',
      position: 'absolute',
      bottom: 30,
    },
  });
