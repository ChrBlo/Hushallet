import { useQueryClient } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Button,
  Divider,
  MD3Theme,
  SegmentedButtons,
  Surface,
  TextInput,
  useTheme,
} from 'react-native-paper';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import GenerateAccessCode from '../components/generate-access-code';
import { auth } from '../firebase_client';
import { householdKeys } from '../infra/hooks/use_household';
import { useHouseholdCreate } from '../infra/hooks/use_household_create';
import {
  householdGetByInvitationCode,
  householdUpdate,
} from '../infra/household_functions';
import { HouseholdUser } from '../types/household_user';

export default function HouseholdModal() {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const s = createStyles(theme);

  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const creatMutation = useHouseholdCreate();

  useEffect(() => {
    if (activeTab === 'create') {
      const code = GenerateAccessCode();
      setAccessCode(code);
    }
  }, [activeTab]);

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

  const handleJoin = async () => {
    const household = await householdGetByInvitationCode(joinCode);
    if (!household) return alert('Inget hushåll finns på angiven kod');

    const newUser: HouseholdUser = {
      id: auth.currentUser!.uid.toString(),
      nickname: displayName.trim(),
      role: 'member',
      icon: 'octopus',
      status: 'active',
    };
    await householdUpdate({
      id: household.id,
      created_by: household.created_by,
      name: household.name,
      invitation_code: household.invitation_code,
      users: [...(household.users ?? []), newUser],
    });

    await queryClient.invalidateQueries({
      queryKey: householdKeys.list(),
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
          <SegmentedButtons
            value={activeTab}
            onValueChange={v => setActiveTab(v as 'create' | 'join')}
            style={s.tabBar}
            buttons={[
              {
                value: 'create',
                label: 'Skapa hushåll',
                style: [
                  s.tabButton,
                  { borderRightWidth: 0 },
                  activeTab === 'create' && s.tabButtonActive,
                ],
                labelStyle: [
                  s.tabLabel,
                  activeTab === 'create' && s.tabLabelActive,
                ],
              },
              {
                value: 'join',
                label: 'Gå med i hushåll',
                style: [
                  s.tabButton,
                  { borderLeftWidth: 0 },
                  activeTab === 'join' && s.tabButtonActive,
                ],
                labelStyle: [
                  s.tabLabel,
                  activeTab === 'join' && s.tabLabelActive,
                ],
              },
            ]}
          />

          <ScrollView key={activeTab} contentContainerStyle={s.scrollContent}>
            {activeTab === 'create' ? (
              <>
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
                  theme={{
                    colors: { onSurfaceVariant: theme.colors.onSurface },
                  }}
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
                  theme={{
                    colors: { onSurfaceVariant: theme.colors.onSurface },
                  }}
                />
              </>
            ) : (
              <>
                <Text style={s.header}>Gå med i hushåll</Text>
                <TextInput
                  style={s.inputTitle}
                  label="Skriv in kod"
                  value={joinCode}
                  onChangeText={setJoinCode}
                  mode="outlined"
                  outlineColor={theme.colors.outlineVariant}
                  activeOutlineColor={theme.colors.outline}
                  textColor={theme.colors.onSurface}
                />
                <TextInput
                  style={s.inputTitle}
                  label="Ditt namn i hushållet"
                  value={displayName}
                  onChangeText={setDisplayName}
                  mode="outlined"
                  outlineColor={theme.colors.outlineVariant}
                  activeOutlineColor={theme.colors.outline}
                  textColor={theme.colors.onSurface}
                />
              </>
            )}
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
              onPress={activeTab === 'create' ? handleSave : handleJoin}
              style={s.button}
              labelStyle={s.buttonLabel}
              contentStyle={s.buttonContent}
              rippleColor="transparent"
            >
              {activeTab === 'create' ? 'Spara' : 'Gå med'}
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
    tabBar: {
      flexDirection: 'row',
      borderRadius: 10,
      borderColor: theme.colors.outlineVariant,
      marginHorizontal: 16,
      marginTop: 16,
    },
    tabButton: {
      flex: 1,
      borderRadius: 10,
      borderWidth: 0,
      backgroundColor: theme.colors.surfaceVariant,
    },
    tabButtonActive: {
      backgroundColor: theme.colors.primaryContainer,
    },
    tabLabel: {
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      fontWeight: '500',
      paddingVertical: 6,
    },
    tabLabelActive: {
      color: theme.colors.onPrimaryContainer,
      fontWeight: '600',
    },
  });
