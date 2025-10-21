import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Button,
  Divider,
  MD3Theme,
  Surface,
  TextInput,
  useTheme,
} from 'react-native-paper';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import GenerateAccessCode from '../components/generate-access-code';
import { auth } from '../firebase_client';
import { useHouseholdCreate } from '../infra/hooks/use_household_create';
import { HouseholdUser } from '../types/household_user';

export default function HouseholdModal() {
  const theme = useTheme();
  const s = createStyles(theme);

  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const creatMutation = useHouseholdCreate();

  useEffect(() => {
    const code = GenerateAccessCode();
    setAccessCode(code);
  }, []);

  const handleSave = async () => {
    const newUser: HouseholdUser = {
      id: auth.currentUser!.uid.toString(),
      nickname: displayName.trim(),
      role: 'admin',
      icon: 'fox',
      status: 'active',
    };
    await creatMutation.mutateAsync({
      name: name.trim(),
      invitation_code: accessCode.trim(),
      users: [newUser],
    });
    router.back();
  };

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
          <ScrollView contentContainerStyle={s.scrollContent}>
            <Text style={s.header}>Lägg till hushåll</Text>

            <TextInput
              style={s.inputTitle}
              label="Namn på hushållet"
              value={name}
              onChangeText={setName}
              mode="outlined"
              maxLength={42}
              outlineColor={theme.colors.outlineVariant}
              activeOutlineColor={theme.colors.outline}
              textColor={theme.colors.onSurface}
              theme={{ colors: { onSurfaceVariant: theme.colors.onSurface } }}
            />
            <TextInput
              style={s.inputTitle}
              label="Ditt namn i hushållet"
              value={displayName}
              onChangeText={setDisplayName}
              mode="outlined"
              maxLength={42}
              outlineColor={theme.colors.outlineVariant}
              activeOutlineColor={theme.colors.outline}
              textColor={theme.colors.onSurface}
              theme={{ colors: { onSurfaceVariant: theme.colors.onSurface } }}
            />
            <View>
              <TextInput
                style={s.inputTitle}
                label={'Generera kod'}
                value={accessCode}
                editable={false}
                mode="outlined"
                outlineColor={theme.colors.outlineVariant}
                activeOutlineColor={theme.colors.outline}
                textColor={theme.colors.onSurface}
                theme={{ colors: { onSurfaceVariant: theme.colors.onSurface } }}
              />
            </View>
          </ScrollView>

          <View style={s.buttonContainer}>
            <Button
              mode="text"
              onPress={() => router.back()}
              style={s.button}
              labelStyle={s.buttonLabel}
              contentStyle={s.buttonContent}
              rippleColor="transparent"
            >
              Avbryt
            </Button>

            <Divider style={s.separator} />

            <Button
              mode="text"
              onPress={handleSave}
              style={s.button}
              labelStyle={s.buttonLabel}
              contentStyle={s.buttonContent}
              rippleColor="transparent"
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
      minHeight: '70%',
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
      paddingVertical: 8,
    },
    separator: {
      borderLeftWidth: 1,
      borderLeftColor: theme.colors.outlineVariant,
      height: '100%',
    },
    buttonLabel: {
      color: theme.colors.onSurface,
      fontSize: 20,
      lineHeight: 22,
    },
    header: {
      fontSize: 20,
      marginBottom: 24,
      color: theme.colors.onPrimaryContainer,
    },
    inputTitle: {
      color: theme.colors.onSurfaceVariant,
      backgroundColor: theme.colors.surfaceVariant,
      marginBottom: 12,
    },
  });
