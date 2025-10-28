import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import Feather from '@expo/vector-icons/Feather';

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
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Inställningar',
          tabBarIcon: ({ color }) => (
            <Feather name="settings" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Uppgifter',
          tabBarIcon: ({ color }) => (
            <Feather name="check-square" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistik',
          tabBarIcon: ({ color }) => (
            <Feather name="pie-chart" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default GroupTabsLayout;
