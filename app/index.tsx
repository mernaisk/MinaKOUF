import React from 'react';
import { Button, View } from 'react-native';
import { Link, useRouter } from 'expo-router'; // or the router library you're using
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IndexScreen() {
  const router = useRouter(); // or use the appropriate hook for your router library




  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Link href="/KOUFindex">Kouf</Link>
    </SafeAreaView>
  );
}
