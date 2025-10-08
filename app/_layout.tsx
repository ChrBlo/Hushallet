import { Stack } from 'expo-router';
import { PaperProvider, ThemeProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { signInWithEmail } from '../infra/auth_functions';
import { useColorScheme } from 'react-native';
import { AppDarkTheme, AppDefaultTheme } from '../theme';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  console.log(colorScheme === "dark" ? "Dark" : "Light");

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
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: true, title: 'Home'}} />
          </Stack>
        </QueryClientProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
