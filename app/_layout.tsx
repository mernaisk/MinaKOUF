import { Stack } from 'expo-router';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

export default function RootLayout() {
  const queryClient = new QueryClient();
  const DefaultOptions = {
    headerShown: false,
    gestureEnabled: true,
    keyboardHandlingEnabled : true,
    }

  return (
    <QueryClientProvider client= {queryClient}>
        <Stack screenOptions={DefaultOptions}>
          <Stack.Screen name="(KOUFtabs)" />
          <Stack.Screen name="index" />
          <Stack.Screen name="addMember"/>
          <Stack.Screen name="editMember"/>

        </Stack>
    </QueryClientProvider>

  );
}
