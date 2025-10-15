import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  MD3Theme,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import StyledButton from '../components/styled-button';
import { signInWithEmail } from '../infra/auth_functions';

export default function LoginScreen() {
  const theme = useTheme();
  const s = createStyles(theme);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const logoSource = theme.dark
    ? require('../assets/images/logowhitebackground1.png')
    : require('../assets/images/logoblackbackground.png');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        'Ofullständiga uppgifter',
        'Har du verkligen fyllt i både användarnamn och lösenord?',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await signInWithEmail(email.trim(), password.trim());
      router.push('/groups');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Inloggning misslyckades',
        'Har du verkligen fyllt i ett korrekt användarnamn och lösenord?',
        [{ text: 'OK' }]
      );
    }
  };

  const handleDevLogin = async () => {
    try {
      await signInWithEmail('test7@test.com', 'testing');
      router.push('/groups');
    } catch (error: any) {
      console.error('Dev login error:', error);
      Alert.alert(
        'Snabbinloggning misslyckades',
        'Den förifyllda testanvändaren kunde inte loggas in automatiskt.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={s.container}
    >
      <Button
        mode="text"
        onPress={handleDevLogin}
        compact
        style={s.devLoginButton}
        textColor={theme.colors.onSurface}
      >
        Logga in som test
      </Button>

      <View style={s.logoContainer}>
        <Image source={logoSource} style={s.logo} resizeMode="contain" />
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
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        style={s.input}
      />

      <View style={s.linksContainer}>
        <Button
          mode="text"
          onPress={() => {}}
          compact
          textColor={theme.colors.onSurface}
        >
          Registrera dig
        </Button>
        <Button
          mode="text"
          onPress={() => {}}
          compact
          textColor={theme.colors.onSurface}
        >
          Glömt lösenord
        </Button>
      </View>

      <StyledButton
        title="Logga in"
        onPress={handleLogin}
        style={s.loginButton}
      />
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      padding: 40,
    },
    devLoginButton: {
      position: 'absolute',
      top: 16,
      left: 16,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },
    logo: {
      width: 150,
      height: 150,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
  });
