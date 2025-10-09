import { BlurView } from 'expo-blur';
import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider, MD3Theme, Surface, Text, TextInput, useTheme } from "react-native-paper";
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import React, { useState } from 'react';
import { CustomDropdown } from '../components/custom-drop-down'

export default function TaskModal() {
  const theme = useTheme();
  const s = createStyles(theme);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState(7);
  const [points, setPoints] = useState(6);

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

            <Text style={s.header}>Lägg till syssla</Text>

            <TextInput style={s.input}
              label="Titel"
              value={title}
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
              options={frequencyOptions}
              onSelect={setFrequency}
            />

            <CustomDropdown
              value={`${points} trist-poäng`}
              options={pointsOptions}
              onSelect={setPoints}
            />

          </ScrollView>

          <View style={s.buttonContainer}>

            {/* TODO Change to SegmentedButtons? */}
            <Button 
              mode="text" 
              onPress={() => router.back()}
              style={s.button}
              labelStyle={s.buttonLabel}
              contentStyle={s.buttonContent}
              rippleColor="transparent"
            >Avbryt
            </Button>

            <Divider style={s.separator}/>

            <Button 
              mode="text" 
              onPress={() => router.back()}
              style={s.button}
              labelStyle={s.buttonLabel}
              contentStyle={s.buttonContent}
              rippleColor="transparent"
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
    sectionLabel: {
      marginBottom: 8,
      marginTop: 8,
    },
    input: {
      color: theme.colors.onSurfaceVariant,
      // borderColor: theme.colors.outlineVariant,
      backgroundColor: theme.colors.surfaceVariant,
      marginBottom: 16,
    },
    dropdownButton: {
      marginBottom: 16,
      justifyContent: 'flex-start',
    },
    dropdownContent: {
      justifyContent: 'space-between',
    },
  });
