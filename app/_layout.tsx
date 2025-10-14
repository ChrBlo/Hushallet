import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider, ThemeProvider } from 'react-native-paper';
import { signInWithEmail } from '../infra/auth_functions';
import HouseholdProvider from '../providers/household_provider';
import { AppDarkTheme, AppDefaultTheme } from '../theme';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  console.log(colorScheme === 'dark' ? 'Dark' : 'Light');

  const theme = colorScheme === 'dark' ? AppDarkTheme : AppDefaultTheme;
  useEffect(() => {
    const signInDevAccount = async () => {
      if (!__DEV__) {
        return;
      }

      try {
        await signInWithEmail('test@test.com', 'testing');
        console.log('logged into dev account');
      } catch (err) {
        console.error('Automatic dev sign-in failed', err);
      }
    };

    signInDevAccount();
  }, []);

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
              <Stack.Screen
                name="groups/index"
                options={{ headerShown: true, title: 'Grupper' }}
              />
              {/* <Stack.Screen */}
              {/*   name="task/index" */}
              {/*   options={{ headerShown: true, title: 'Task' }} */}
              {/* /> */}
              {/* <Stack.Screen */}
              {/*   name="task-modal" */}
              {/*   options={{ */}
              {/*     presentation: 'transparentModal', */}
              {/*     animation: 'fade', */}
              {/*     headerShown: false, */}
              {/*   }} */}
              {/* /> */}
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
