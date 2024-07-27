import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function RootLayout() {
  const queryClient = new QueryClient();
  const DefaultOptions = {
    headerShown: false,
    gestureEnabled: true,
    keyboardHandlingEnabled: true,
    contentStyle: styles.screenContent,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <Stack screenOptions={DefaultOptions}>
          <Stack.Screen
            name="(KOUFtabs)"
            options={{ contentStyle: styles.screenContent }}
          />
          <Stack.Screen
            name="(YOUTHtabs)"
            options={{ contentStyle: styles.screenContent }}
          />
          <Stack.Screen
            name="index"
            options={{ contentStyle: styles.screenContent }}
          />

          <Stack.Screen
            name="memberScreens/addMember"
            options={{ contentStyle: styles.screenContent }}
          />
          <Stack.Screen
            name="memberScreens/editMember"
            options={{ contentStyle: styles.screenContent }}
          />
          <Stack.Screen
            name="memberScreens/memberInfo"
            options={{ contentStyle: styles.screenContent }}
          />

          <Stack.Screen
            name="attendenceScreens/sheetDetails"
            options={{ contentStyle: styles.screenContent }}
          />
          <Stack.Screen
            name="attendenceScreens/createAttendenceSheet"
            options={{ contentStyle: styles.screenContent }}
          />
          <Stack.Screen
            name="attendenceScreens/editAttendenceSheet"
            options={{ contentStyle: styles.screenContent }}
          />

          <Stack.Screen
            name="eventScreens/createEvent"
            options={{ contentStyle: styles.screenContent }}
          />
          <Stack.Screen
            name="eventScreens/editEvent"
            options={{ contentStyle: styles.screenContent }}
          />
          <Stack.Screen
            name="eventScreens/eventInfo"
            options={{ contentStyle: styles.screenContent }}
          />
        </Stack>
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
    backgroundColor: "#9a8c98", 
  },
});
