import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  QueryClientProvider,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import { UserProvider, useUser } from "../context/userContext";
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
import AddChurch from "./RIKSKOUFScreens/addChurch";
import {
  getLeadersInOneChurch,
  getMembersInOneChurch,
} from "@/firebase/firebaseModelMembers";
import { getAllDocInCollection } from "@/firebase/firebaseModel";
import CreateQuestion from "./challenge/createQuestion";
import EditQuestion from "./challenge/editQuestion";
import { getAllSheetsForOneChurch } from "@/firebase/firebaseModelAttendence";
import { getChallengeInOneChurch } from "@/firebase/firebaseModelChallenge";

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
          <AuthChecker DefaultOptions={DefaultOptions} />
        </UserProvider>
      </QueryClientProvider>
    </NavigationContainer>
  );
}

function AuthChecker({ DefaultOptions }: any) {
  const { userInfo, isUserLoading } = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (userInfo?.IsActiveInKOUF === "Yes") {
      queryClient.prefetchQuery({
        queryKey: ["MembersInOneChurch", userInfo.OrginizationIdKOUF],
        queryFn: () => getMembersInOneChurch(userInfo.OrginizationIdKOUF),
      });
      queryClient.prefetchQuery({
        queryFn: () => getAllSheetsForOneChurch(userInfo.OrginizationIdKOUF),
        queryKey: ["allAttendenceSheets", userInfo.OrginizationIdKOUF],
      });
      queryClient.prefetchQuery({
        queryKey: ["LeadersInOneChurch", userInfo.OrginizationIdKOUF],
        queryFn: () => getLeadersInOneChurch(userInfo.OrginizationIdKOUF),
      });
      queryClient.prefetchQuery({
        queryFn: async () => {
          const result = await getChallengeInOneChurch(
            userInfo.OrginizationIdKOUF
          );
          return result ?? null; 
        },
        queryKey: ["Question", userInfo.OrginizationIdKOUF],
      });
    }

    if (userInfo?.IsActiveInRiksKOUF === "Yes") {
      queryClient.prefetchQuery({
        queryFn: () => getAllDocInCollection("Members"),
        queryKey: ["allMembers"],
      });
      queryClient.prefetchQuery({
        queryFn: () => getAllDocInCollection("Churchs"),
        queryKey: ["churchs"],
      });
      queryClient.prefetchQuery({
        queryFn: () => getAllDocInCollection("RiksKOUFInfo"),
        queryKey: ["RiksKOUFInfo"],
      });
    }

    queryClient.prefetchQuery({
      queryFn: () => getAllDocInCollection("Events"),
      queryKey: ["allEvents"],
    });

  }, [userInfo, queryClient]);

  if (isUserLoading) {
    return <Loading />;
  }

  return (
    <Stack.Navigator screenOptions={DefaultOptions}>
      {userInfo ? (
        <>
          {userInfo?.IsActiveInRiksKOUF === "Yes" && (
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
                name="AddChurch"
                component={AddChurch}
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

            <Stack.Screen
              name="CreateQuestion"
              component={CreateQuestion}
              options={{ contentStyle: styles.screenContent }}
            />
            <Stack.Screen
              name="EditQuestion"
              component={EditQuestion}
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
