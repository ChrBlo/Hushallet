import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider, MD3Theme, Surface, Text, TextInput, useTheme } from "react-native-paper";
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { CustomDropdown } from '../components/custom-drop-down';
import { requireCurrentUser } from '../infra/auth_functions';
import { useTaskCreate } from '../infra/hooks/use_task_create';
import { useTaskUpdate } from '../infra/hooks/use_task_update';
import { householdGet } from '../infra/household_functions';

export default function TaskModal() {
  const theme = useTheme();
  const s = createStyles(theme);
    
  const params = useLocalSearchParams();
  const isEditing = !!params.taskId;

  const [title, setTitle] = useState(params.title?.toString() || "");
  const [description, setDescription] = useState(params.description?.toString() || "");
  const [frequency, setFrequency] = useState(params.frequency ? parseInt(params.frequency.toString()) : 7);
  const [points, setPoints] = useState(params.points ? parseInt(params.points.toString()) : 6);

  const createMutation = useTaskCreate();
  const updateMutation = useTaskUpdate();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  // const currentUser = requireCurrentUser();

  const frequencyOptions = Array.from({ length: 31 }, (_, i) => {
    const days = i + 1;
    let label: string;
    
    if (days === 1) label = 'Varje dag';
    else if (days === 2) label = 'Varannan dag'; 
    else if ([3, 13, 23].includes(days)) label = `Var ${days}:e dag`;
    else if ([1, 2].includes(days % 10) && days > 20) label = `Var ${days}:a dag`;
    else label = `Var ${days}:e dag`;
    
    return { label, value: days };
  });

  const pointsOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1} poäng`,
    value: i + 1
  }));

  const handleSave = async () => { 

    if (isEditing)
    {
      await updateMutation.mutateAsync({
        taskId: params.taskId.toString(),
        updates: {
          title: title,
          description: description,
          frequency,
          points,
        }
      });
    }
    else
    { 
      //TODO FIXA DEN HÄR SÅ VI GÅR PÅ VÅRT RIKTIGA CURRENT HOUSEHOLD
      const FAKED_CURRENT_HOUSEHOLD = await householdGet("0");

      if (!FAKED_CURRENT_HOUSEHOLD?.id) {
        alert('Kunde inte hitta hushåll');
        return;
      }
      
      await createMutation.mutateAsync({
        household_id: FAKED_CURRENT_HOUSEHOLD.id,
        title: title,
        description: description,
        created_date: new Date(),
        execution_date: null,
        frequency: frequency,
        points: points,
        status: 'active',
        users: [],
      })
    }

    router.back();
  }

  return (
    <Animated.View 
      entering={FadeIn.duration(200)}
      style={s.backdrop}
    >
      <BlurView intensity={15} style={StyleSheet.absoluteFill} tint={theme.dark ? "dark" : "light"} />
      
      <Animated.View 
        entering={FadeInDown.duration(300).springify()}
        style={s.modalContainer}
      >
        <Surface style={s.card} elevation={5}>
          <ScrollView contentContainerStyle={s.scrollContent}>

            <Text style={s.header}>
              {isEditing ? 'Ändra syssla' : 'Lägg till syssla'}
            </Text>

            <TextInput style={s.input}
              label="Titel"
              value={title}
              defaultValue={title}
              onChangeText={setTitle}
              mode="outlined"
              maxLength={42}
              outlineColor={theme.colors.outlineVariant}
              activeOutlineColor={theme.colors.outline} 
              textColor={theme.colors.onSurface} // When typing
              theme={{ colors: {onSurfaceVariant: theme.colors.onSurface,} }} // LAbel color
            />

            <TextInput 
              label="Beskrivning"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={4}
              maxLength={250}style={[s.input, { minHeight: 120 }]}
              textAlignVertical="top"
              outlineColor={theme.colors.outlineVariant}
              activeOutlineColor={theme.colors.outline}
              textColor={theme.colors.onSurface}// When typing
              theme={{ colors: {onSurfaceVariant: theme.colors.onSurface} }} // LAbel color
            />

            <CustomDropdown
              value={frequency === 1 ? "Varje dag" : `Var ${frequency}:e dag`}
              selectedValue={frequency}
              options={frequencyOptions}
              onSelect={setFrequency}
            />

            <CustomDropdown
              value={`${points} trist-poäng`}
              selectedValue={points}
              options={pointsOptions}
              onSelect={setPoints}
            />

          </ScrollView>

          <View style={s.buttonContainer}>

            <Button 
              mode="text" 
              onPress={() => router.back()}
              style={s.button}
              labelStyle={s.buttonLabel}
              contentStyle={s.buttonContent}
              rippleColor="transparent"
              disabled={isSaving}
            >Avbryt
            </Button>

            <Divider style={s.separator}/>

            <Button 
              mode="text" 
              onPress={handleSave}
              style={s.button}
              labelStyle={s.buttonLabel}
              contentStyle={s.buttonContent}
              rippleColor="transparent"
              disabled={isSaving}
              loading={isSaving}
            >Spara
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
      marginBottom: 16,
    },
    card: {
      minHeight: '84%',
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 15,
      backgroundColor: theme.colors.surface,
    },
    scrollContent: {
      padding: 24,
      paddingBottom: 8,
    },
    header: {
      fontSize: 20,
      marginBottom: 24,
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
    input: {
      color: theme.colors.onSurfaceVariant,
      backgroundColor: theme.colors.surfaceVariant,
      marginBottom: 16,
    },
  });
