import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, MD3Theme, Text, TextInput, useTheme } from "react-native-paper";
import StyledButton from '../components/styled-button';

export default function LoginScreen() {
  const theme = useTheme();
  const s = createStyles(theme);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logoSource = theme.dark
  ? require('../assets/images/logowhitebackground1.png')
  : require('../assets/images/logoblackbackground.png');

  return (

    <View style={s.container}>
      <View style={s.logoContainer}>
        <Image source={logoSource} style={s.logo} resizeMode="contain"/>
      </View>

      <Text variant="headlineMedium" style={s.title}>
        Logga in
      </Text>

      <TextInput
        label="Användarnamn"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        activeOutlineColor={theme.colors.outline} 
        autoCapitalize="none"
        keyboardType="email-address"
        style={s.input}
      />

      <TextInput
        label="Lösenord"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        activeOutlineColor={theme.colors.outline} 
        style={s.input}
      />

      <View style={s.linksContainer}>
        <Button mode="text" onPress={()=>{}} compact textColor={theme.colors.onSurface}>Registrera dig</Button>
        <Button mode="text" onPress={()=>{}} compact textColor={theme.colors.onSurface}>Glömt lösenord</Button>
      </View>

      <StyledButton
        title="Logga in"
        onPress={() => router.push('/groups')}
        style={s.loginButton}
      />
    </View>
  );
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      padding: 40,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 24,
    },
    logo: {
      width: 150,
      height: 150,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      textAlign: "center",
      marginBottom: 24,
    },
    input: {
      marginBottom: 16,
      backgroundColor: theme.colors.surfaceVariant,
    },
    loginButton: {
      marginTop: 8,
    },
    loginButtonContent: {
      paddingVertical: 8,
    },
    linksContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
    },
  });