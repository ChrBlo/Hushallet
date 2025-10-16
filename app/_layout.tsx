import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { PaperProvider, ThemeProvider } from 'react-native-paper';
import HouseholdProvider from '../providers/household_provider';
import { AppDarkTheme, AppDefaultTheme } from '../theme';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  console.log(colorScheme === 'dark' ? 'Dark' : 'Light');

  const theme = colorScheme === 'dark' ? AppDarkTheme : AppDefaultTheme;

  return (
    <PaperProvider theme={theme} key={colorScheme}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <HouseholdProvider>
            <Stack>
              <Stack.Screen
                name="index"
                options={{ headerShown: true, title: 'Login' }}
              />
              <Stack.Screen name="groups" options={{ headerShown: false }} />
              <Stack.Screen
                name="statistics"
                options={{ headerShown: true, title: 'Statistics' }}
              />
            </Stack>
          </HouseholdProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
