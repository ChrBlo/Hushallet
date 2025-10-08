import { BlurView } from 'expo-blur';
import { router } from "expo-router";
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, MD3Theme, Surface, Text, TextInput, useTheme } from "react-native-paper";
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function TaskModal() {
  const theme = useTheme();
  const s = createStyles(theme);
  
  const [text, setText] = useState("");
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
            <TextInput
              label="Titel"
              value={text}
              onChangeText={setText}
              mode="outlined"
            />
          </ScrollView>

          <View style={s.buttonContainer}>

            <Button 
              mode="text" 
              onPress={() => router.back()}
              style={s.button}
              labelStyle={s.buttonLabel}
              contentStyle={s.buttonContent}
            >Avbryt
            </Button>

            <View style={s.separator} />

            <Button 
              mode="text" 
              onPress={() => router.back()}
              style={s.button}
              labelStyle={s.buttonLabel}
              contentStyle={s.buttonContent}
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
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContainer: {
      maxHeight: '85%',
      marginHorizontal: 16,
      marginBottom: 16,
    },
    card: {
      minHeight: '84%',
      borderWidth: 1,
      borderColor: theme.dark ? '#4c4d53' : '#c7c7c7',
      borderRadius: 15,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
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
      padding: 16,
      paddingBottom: 20,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outlineVariant,
    },
    button: {
      flex: 1,
    },
    buttonContent: {
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 20,
      paddingVertical: 6,
    },
    separator: {
      borderLeftWidth: 1,
      borderLeftColor: theme.dark ? '#4c4d53' : '#c7c7c7',
      height: '100%',
    },
    buttonLabel: {
      fontSize: 20,
    },
  });
