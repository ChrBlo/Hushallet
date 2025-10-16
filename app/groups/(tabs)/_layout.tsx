import { Stack, Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';

function GroupTabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.primary,
        },
        tabBarActiveTintColor: theme.colors.onPrimary,
        tabBarInactiveTintColor: theme.colors.onPrimaryContainer,
      }}
    >
      <Tabs.Screen name="settings" options={{ title: 'Inställningar' }} />
      <Tabs.Screen name="index" options={{ title: 'Uppgifter' }} />
      <Tabs.Screen name="statistics" options={{ title: 'Statistik' }} />
      <Stack.Screen
        name="task-modal"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

export default GroupTabsLayout;
