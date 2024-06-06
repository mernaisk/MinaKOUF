import "../tamagui-web.css";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack} from "expo-router";
import { TamaguiProvider } from "tamagui";
import {colors} from "tamagui"

import { tamaguiConfig } from "../tamagui.config";
import { useColorScheme } from "react-native";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  const DefaultOptions = {
    headerShown: false,
    gestureEnabled: true,
    keyboardHandlingEnabled : true,
    }
  return (
    <QueryClientProvider client= {queryClient}>
      <TamaguiProvider
        config={tamaguiConfig}
        defaultTheme={colorScheme ?? "light"}
      >
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={DefaultOptions}>
            <Stack.Screen name="index"/>
            <Stack.Screen name="KOUF"/>
            <Stack.Screen name="Youth"/>
            <Stack.Screen name="allMembers"/>
            <Stack.Screen name ="MemberInfo"/>
          </Stack>
        </ThemeProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
