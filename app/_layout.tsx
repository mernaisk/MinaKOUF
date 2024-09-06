import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { UserProvider, useUser } from "../context/userContext";
import { ChurchProvider, useChurch } from "../context/churchContext";
import SplashScreen from "../components/SplashScreen";
import AddMember from "./memberScreens/addMember";
import Home from "./home";
import LogIn from "./logIn";
import Index from "./index";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Loading } from "@/components/loading";
import KOUFTabLayout from "./(KOUFtabs)/_layout";
import YOUTHTabLayout from "./(YOUTHtabs)/_layout";
import ForgotPassword from "./forgotPassword";
import CreateAttendenceSheet from "./attendenceScreens/createAttendenceSheet";
import SheetDetails from "./attendenceScreens/sheetDetails";
import EventInfo from "./eventScreens/eventInfo";
import CreateEvent from "./eventScreens/createEvent";
import EditEvent from "./eventScreens/editEvent";
import EditAttendenceSheet from "./attendenceScreens/editAttendenceSheet";
import EditMember from "./memberScreens/editMember";
import MemberInfo from "./memberScreens/memberInfo";
import RIKSKOUFhome from "./RIKSKOUFhome";
import Events from "./RIKSKOUFScreens/events";
import Churchs from "./RIKSKOUFScreens/churchs";
import Members from "./RIKSKOUFScreens/members";

import { RootStackParamList } from "@/constants/types";
import Booking from "./paymentsScreens/booking";
import PaymentInfo from "./paymentsScreens/paymentInfo";
import Payments from "./paymentsScreens/payments";

const Stack = createNativeStackNavigator<RootStackParamList>();

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
          <ChurchProvider>
            <AuthChecker DefaultOptions={DefaultOptions} />
          </ChurchProvider>
        </UserProvider>
      </QueryClientProvider>
    </NavigationContainer>
  );
}

function AuthChecker({ DefaultOptions }) {
  const { user, userInfo, isUserLoading } = useUser();

  if (isUserLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={DefaultOptions}>
      {userInfo ? (
        <>
          {userInfo?.Category.Name === "RiksKOUF" && (
            <>
              <Stack.Screen
                name="RIKSKOUFhome"
                component={RIKSKOUFhome}
                options={{ contentStyle: styles.screenContent }}
              />

              <Stack.Screen
                name="Events"
                component={Events}
                options={{ contentStyle: styles.screenContent }}
              />
              <Stack.Screen
                name="Churchs"
                component={Churchs}
                options={{ contentStyle: styles.screenContent }}
              />
              <Stack.Screen
                name="Members"
                component={Members}
                options={{ contentStyle: styles.screenContent }}
              />
            </>
          )}
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

            <Stack.Screen
              name="CreateAttendenceSheet"
              component={CreateAttendenceSheet}
              options={{ contentStyle: styles.screenContent }}
            />
            <Stack.Screen
              name="SheetDetails"
              component={SheetDetails}
              options={{ contentStyle: styles.screenContent }}
            />
            <Stack.Screen
              name="EditAttendenceSheet"
              component={EditAttendenceSheet}
              options={{ contentStyle: styles.screenContent }}
            />

            <Stack.Screen
              name="EventInfo"
              component={EventInfo}
              options={{ contentStyle: styles.screenContent }}
            />
            <Stack.Screen
              name="CreateEvent"
              component={CreateEvent}
              options={{ contentStyle: styles.screenContent }}
            />
            <Stack.Screen
              name="EditEvent"
              component={EditEvent}
              options={{ contentStyle: styles.screenContent }}
            />

            <Stack.Screen
              name="EditMember"
              component={EditMember}
              options={{ contentStyle: styles.screenContent }}
            />
            <Stack.Screen
              name="MemberInfo"
              component={MemberInfo}
              options={{ contentStyle: styles.screenContent }}
            />

            <Stack.Screen
              name="Booking"
              component={Booking}
              options={{ contentStyle: styles.screenContent }}
            />
            <Stack.Screen
              name="PaymentInfo"
              component={PaymentInfo}
              options={{ contentStyle: styles.screenContent }}
            />
            <Stack.Screen
              name="Payments"
              component={Payments}
              options={{ contentStyle: styles.screenContent }}
            />
          </>
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
            name="AddMember"
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
