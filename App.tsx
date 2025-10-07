import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase_client';

export default function App() {
  useEffect(() => {
    const checkFirestore = async () => {
      try {
        const snapshot = await getDocs(collection(db, '__firebase_ping'));
        console.log('Firestore reachable, docs:', snapshot.size);
      } catch (err) {
        console.error('Firestore ping failed', err);
      }
    };

    checkFirestore();
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
