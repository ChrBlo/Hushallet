import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Divider,
  MD3Theme,
  Surface,
  useTheme,
} from 'react-native-paper';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function HouseholdModal() {
  const theme = useTheme();
  const s = createStyles(theme);
  return (
    <Animated.View entering={FadeIn.duration(200)} style={s.backdrop}>
      <BlurView
        intensity={15}
        style={StyleSheet.absoluteFill}
        tint={theme.dark ? 'dark' : 'light'}
      />
      <Animated.View
        entering={FadeInDown.duration(300).springify()}
        style={s.modalContainer}
      >
        <Surface style={s.card} elevation={5}>
          <ScrollView contentContainerStyle={s.scrollContent}></ScrollView>
          <View style={s.buttonContainer}>
            <Button
              mode="text"
              onPress={() => router.back()}
              style={s.button}
              labelStyle={s.buttonLabel}
              contentStyle={s.buttonContent}
              rippleColor="transparent"
              /* disabled={} */
            >
              Avbryt
            </Button>

            <Divider style={s.separator} />

            <Button
              mode="text"
              onPress={() => {}}
              style={s.button}
              labelStyle={s.buttonLabel}
              contentStyle={s.buttonContent}
              rippleColor="transparent"
              /* disabled={} */
              /* loading={} */
            >
              Spara
            </Button>
          </View>
        </Surface>
      </Animated.View>
    </Animated.View>
  );
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      maxHeight: '85%',
      marginHorizontal: 16,
      marginBottom: 130,
    },
    card: {
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 15,
      backgroundColor: theme.colors.surface,
    },
    scrollContent: {
      padding: 24,
      paddingBottom: 8,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      padding: 12,
      paddingBottom: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outlineVariant,
    },
    button: {
      flex: 1,
      borderRadius: 0,
    },
    buttonContent: {
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 20,
      paddingVertical: 6,
    },
    separator: {
      borderLeftWidth: 1,
      borderLeftColor: theme.colors.outlineVariant,
      height: '100%',
    },
    buttonLabel: {
      color: theme.colors.onSurface,
      fontSize: 20,
    },
  });
