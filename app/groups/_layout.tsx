import { Stack } from 'expo-router';
import HouseholdHeaderAvatarButton from '../../components/household-header-avatar-button';

const GroupsLayout = () => (
  <Stack>
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

export default GroupsLayout;
