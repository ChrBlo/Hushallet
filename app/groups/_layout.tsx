import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';
import HouseholdHeaderAvatarButton from '../../components/household-header-avatar-button';
import ThemeButton from '../../components/theme-button';

export default function GroupsLayout() {
  const theme = useTheme();

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
          title: 'Grupper',
          headerRight: () => <ThemeButton />,
        }}
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
