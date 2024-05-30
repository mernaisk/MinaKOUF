import "../tamagui-web.css";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";

import { tamaguiConfig } from "../tamagui.config";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider
      config={tamaguiConfig}
      defaultTheme={colorScheme ?? "light"}
    >
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" />
        </Stack>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
