import { ScrollView, StyleSheet, Text } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import { useHouseholdGet } from '../../../infra/hooks/use_household';
import { useSelectedHouseholdId } from '../../../providers/household_provider';
import { auth } from '../../../firebase_client';
import HouseholdSettingsAdmin from '../../../components/household-settings-admin';
import HouseholdSettingsMember from '../../../components/household-settings-member';

export default function StatisticsScreen() {
  const theme = useTheme();
  const s = createStyles(theme);
  const households = useHouseholdGet();
  const { selectedHouseholdId } = useSelectedHouseholdId();

  const selectedHousehold = households.data?.find(
    h => h.household.id === selectedHouseholdId
  );

  const isAdmin =
    selectedHousehold?.household.created_by === auth.currentUser?.uid;

  return (
    <ScrollView style={s.scrollView} contentContainerStyle={s.container}>
      {isAdmin && (
        <HouseholdSettingsAdmin houseHold={selectedHousehold!.household} />
      )}
      {!isAdmin && (
        <HouseholdSettingsMember houseHold={selectedHousehold!.household} />
      )}
    </ScrollView>
  );
}

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
  });
