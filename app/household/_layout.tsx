import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';
import HouseholdHeaderAvatarButton from '../../components/household-header-avatar-button';
import ThemeButton from '../../components/theme-button';
import { useHouseholdGet } from '../../infra/hooks/use_household';
import { useSelectedHouseholdId } from '../../providers/household_provider';

export default function GroupsLayout() {
  const households = useHouseholdGet();
  const { selectedHouseholdId } = useSelectedHouseholdId();
  const theme = useTheme();

  const selectedHousehold = households.data?.find(
    h => h.household.id === selectedHouseholdId
  );

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: 'Dina Hushåll',
          headerRight: () => <ThemeButton />,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          title: `${selectedHousehold?.household.name || 'Hushåll'}`,
          headerRight: () => <HouseholdHeaderAvatarButton />,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{ headerShown: true, title: 'Profil' }}
      />
    </Stack>
  );
}
