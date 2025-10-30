import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';
import CustomThemeProvider from '../providers/custom-theme-provider';
import HouseholdProvider from '../providers/household_provider';

const queryClient = new QueryClient();

const App = () => {
  const theme = useTheme();
  return (
    <QueryClientProvider client={queryClient}>
      <HouseholdProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: theme.colors.onSurface,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{ headerShown: true, title: 'Login' }}
          />
          <Stack.Screen
            name="sign-up"
            options={{ headerShown: true, title: 'Register' }}
          />
          <Stack.Screen name="household" options={{ headerShown: false }} />
          <Stack.Screen
            name="statistics"
            options={{ headerShown: true, title: 'Statistics' }}
          />
          <Stack.Screen
            name="task-modal"
            options={{
              presentation: 'transparentModal',
              animation: 'fade',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="view-task-modal"
            options={{
              presentation: 'transparentModal',
              animation: 'fade',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="household-modal"
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
              headerShown: false,
            }}
          />
        </Stack>
      </HouseholdProvider>
    </QueryClientProvider>
  );
};

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <App />
    </CustomThemeProvider>
  );
}
