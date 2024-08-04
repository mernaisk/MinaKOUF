import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen({ onAnimationEnd }) {
  useEffect(() => {
    setTimeout(() => {
      onAnimationEnd();
    }, 3000); // Show the splash screen for 3 seconds
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>ST MINA KOUF</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9a8c98',
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
  },
});
