import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';
import HouseholdHeaderAvatarButton from '../../components/household-header-avatar-button';

export default function GroupsLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: true, title: 'Grupper' }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          title: 'Hushåll',
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
