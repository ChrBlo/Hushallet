import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { MD3Theme, Text, TextInput, useTheme } from "react-native-paper";

export default function TaskModal() {
  const theme = useTheme();
  const s = createStyles(theme);
  
  const [text, setText] = React.useState("");

  return (

    <View style={s.container}>
      <ScrollView style={s.scrollContent}>

        <Text style={s.header}>Lägg till syssla</Text>
        <TextInput style={s.inputFields}
          placeholder="Titel"
          value={text}
          // onChangeText={text => setTitle(value);}}
        />

      </ScrollView>
    </View>
  );
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: 16,
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    inputFields: {
      fontSize: 20,
    },
  });
