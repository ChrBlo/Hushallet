import { ScrollView, StyleSheet, Text } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';

export default function StatisticsScreen() {
  const theme = useTheme();
  const s = createStyles(theme);
  return (
    <ScrollView style={s.scrollView} contentContainerStyle={s.container}>
      <Text>Inställningar</Text>
    </ScrollView>
  );
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      paddingTop: 10,
      gap: 10,
    },
    scrollView: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
