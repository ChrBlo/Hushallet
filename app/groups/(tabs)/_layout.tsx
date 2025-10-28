import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';

function GroupTabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.surface,
        },
        tabBarActiveTintColor: theme.colors.onSurface,
        tabBarInactiveTintColor: theme.colors.outlineVariant,
      }}
    >
      <Tabs.Screen name="settings" options={{ title: 'Inställningar' }} />
      <Tabs.Screen name="index" options={{ title: 'Uppgifter' }} />
      <Tabs.Screen name="statistics" options={{ title: 'Statistik' }} />
    </Tabs>
  );
}

export default GroupTabsLayout;
