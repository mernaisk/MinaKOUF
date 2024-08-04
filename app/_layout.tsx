import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { UserProvider, useUser } from "../context/userContext";
import SplashScreen from "../components/SplashScreen";
import AddMember from "./memberScreens/AddMember";
import Home from "./Home";
import KOUFindex from "./(KOUFtabs)/KOUFindex";
import YOUTHindex from "./(YOUTHtabs)/YOUTHindex";
import LogIn from "./LogIn";
import Index from "./Index";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Loading } from "@/components/loading";
import KOUFTabLayout from "./(KOUFtabs)/_layout"; // Update the path as necessary
import YOUTHTabLayout from "./(YOUTHtabs)/_layout";
import ForgotPassword from "./ForgotPassword";

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const queryClient = new QueryClient();
  const DefaultOptions = {
    headerShown: false,
    gestureEnabled: true,
    keyboardHandlingEnabled: true,
    contentStyle: styles.screenContent,
  };

  return (
    <NavigationContainer independent={true}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <AuthChecker DefaultOptions={DefaultOptions} />
        </UserProvider>
      </QueryClientProvider>
    </NavigationContainer>
  );
}

function AuthChecker({ DefaultOptions }) {
  const { user, isLoading } = useUser();
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!isLoading && !showSplash) {
      setIsLoggedIn(user && user.uid ? true : false);
    }
  }, [user, isLoading, showSplash]);

  const handleAnimationEnd = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onAnimationEnd={handleAnimationEnd} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Stack.Navigator screenOptions={DefaultOptions}>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ contentStyle: styles.screenContent }}
          />
          <Stack.Screen
            name="KOUFtabs"
            component={KOUFTabLayout}
            options={{ contentStyle: styles.screenContent }}
          />
          <Stack.Screen
            name="YOUTHtabs"
            component={YOUTHTabLayout}
            options={{ contentStyle: styles.screenContent }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Index"
            component={Index}
            options={{ contentStyle: styles.screenContent }}
          />
          <Stack.Screen
            name="LogIn"
            component={LogIn}
            options={{ contentStyle: styles.screenContent }}
          />
          <Stack.Screen
            name="memberScreens/AddMember"
            component={AddMember}
            options={{ contentStyle: styles.screenContent }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ contentStyle: styles.screenContent }}
          />
        </>
      )}
    </Stack.Navigator>
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9a8c98",
  },
});

{
  /* </Stack.Screen> */
}
{
  /* <Stack.Screen
              name="memberScreens/editMember"
              options={{ cardStyle: styles.screenContent }}
            >
            </Stack.Screen>
            <Stack.Screen
              name="memberScreens/memberInfo"
              options={{ cardStyle: styles.screenContent }}
            >
            </Stack.Screen>
            <Stack.Screen
              name="attendenceScreens/sheetDetails"
              options={{ cardStyle: styles.screenContent }}
            >
            </Stack.Screen>
            <Stack.Screen
              name="attendenceScreens/createAttendenceSheet"
              options={{ cardStyle: styles.screenContent }}
            >
            </Stack.Screen>
            <Stack.Screen
              name="attendenceScreens/editAttendenceSheet"
              options={{ cardStyle: styles.screenContent }}
            >
            </Stack.Screen>
            <Stack.Screen
              name="eventScreens/createEvent"
              options={{ cardStyle: styles.screenContent }}
            >
            </Stack.Screen>
            <Stack.Screen
              name="eventScreens/editEvent"
              options={{ cardStyle: styles.screenContent }}
            >
            </Stack.Screen>
            <Stack.Screen
              name="eventScreens/eventInfo"
              options={{ cardStyle: styles.screenContent }}
            >
            </Stack.Screen> */
}
