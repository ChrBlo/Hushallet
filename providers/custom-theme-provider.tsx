import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { AppDarkTheme, AppDefaultTheme } from '../theme';
import { PaperProvider, ThemeProvider } from 'react-native-paper';

interface ContextValue {
  getThemeSetting: () => ThemeSetting;
  cycleTheme: () => void;
}

export interface ThemeSetting {
  setting: 'auto' | 'light' | 'dark';
}

const THEME_SETTING_KEY = 'theme_setting';

const setStoredThemeSetting = async (setting: ThemeSetting) => {
  await AsyncStorage.setItem(THEME_SETTING_KEY, JSON.stringify(setting));
};

const getStoredThemeSetting = async (): Promise<ThemeSetting> => {
  const data = await AsyncStorage.getItem(THEME_SETTING_KEY);
  return data ? (JSON.parse(data) as ThemeSetting) : { setting: 'auto' };
};

const CustomThemeContext = createContext({} as ContextValue);

export default function CustomThemeProvider(props: PropsWithChildren) {
  const [themeSetting, setThemeSettingSetting] = useState<ThemeSetting>({
    setting: 'auto',
  });
  const getThemeSetting = () => themeSetting;

  const colorScheme = useColorScheme();

  let theme;
  if (themeSetting.setting === 'auto') {
    theme = colorScheme === 'dark' ? AppDarkTheme : AppDefaultTheme;
  } else if (themeSetting.setting === 'light') {
    theme = AppDefaultTheme;
  } else {
    theme = AppDarkTheme;
  }

  const cycleTheme = () => {
    let next: ThemeSetting;

    if (themeSetting.setting === 'auto') {
      next = { setting: 'light' };
    } else if (themeSetting.setting === 'light') {
      next = { setting: 'dark' };
    } else {
      next = { setting: 'auto' };
    }

    setThemeSettingSetting(next);
    setStoredThemeSetting(next);
  };

  useEffect(() => {
    const getAndSet = async () => {
      const setting = await getStoredThemeSetting();
      setThemeSettingSetting(setting);
    };
    getAndSet();
  }, []);

  return (
    <CustomThemeContext.Provider value={{ getThemeSetting, cycleTheme }}>
      <PaperProvider theme={theme} key={colorScheme}>
        <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
      </PaperProvider>
    </CustomThemeContext.Provider>
  );
}

export const useCustomTheme = () => useContext(CustomThemeContext);
