import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import { signInWithEmail } from './infra/auth_functions';

export default function App() {
  useEffect(() => {
    const signInDevAccount = async () => {
      if (!__DEV__) {
        return;
      }

      try {
        await signInWithEmail('test@test.com', 'testing');
        console.log('logged into dev account');
      } catch (err) {
        console.error('Automatic dev sign-in failed', err);
      }
    };

    signInDevAccount();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Image
        source={require('./assets/images/logoblackbackground.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
});
