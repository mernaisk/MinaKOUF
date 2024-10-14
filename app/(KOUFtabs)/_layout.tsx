import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FontAwesome6 } from "@expo/vector-icons";
import { useUser } from "@/context/userContext";
import KOUFindex from "./KOUFindex"; 
import Events from "./events"; 
import Youth from "./youth"; 
import Reports from "./reports"; 
import Attendance from "./attendence"; 
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/types";
import { Image } from 'expo-image';
import { Loading } from "@/components/loading";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

function CustomHeader() {
  const { user, userInfo, isLoading } = useUser();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const getInitials = (name:any) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  return (
    <SafeAreaView style={headerStyles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")} // Change to your home screen
      >
        <MaterialIcons
          name="church"
          size={45}
          color="#363852"
          style={headerStyles.icon}
        />
      </TouchableOpacity>
      <Text style={headerStyles.title}>St: Mina KOUF</Text>
      <TouchableOpacity
      onPress={() => navigation.navigate('MemberInfo', { memberId: user?.uid })}
      >
        {isLoading && <Loading/>}
        {!isLoading && userInfo?.ProfilePicture?.URL ? (
          <Image
            source={{ uri: userInfo?.ProfilePicture?.URL }}
            style={headerStyles.profilePicture}
          />
        ) : (
          <View style={headerStyles.profileInitials}>
            <Text style={headerStyles.initialsText}>
              {getInitials(userInfo?.Name)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      </SafeAreaView>
  );
}

export default function KOUFTabLayout() {
  const { width } = Dimensions.get("window");
  const tabBarWidth = width * 0.95;

  return (
      <Tab.Navigator
        screenOptions={{
          header: () => <CustomHeader />,
          tabBarActiveTintColor: "#363852",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            ...styles.tabBar,
            width: tabBarWidth,
            marginHorizontal: (width - tabBarWidth) / 2,
            borderBottomEndRadius: 50,
            borderBottomStartRadius: 50,
            borderWidth: 4,
            borderColor: "#726d81",
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "bold",
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen
          name="KOUFindex"
          component={KOUFindex}
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome5
                name="home"
                size={24}
                color={focused ? "#363852" : "grey"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Events"
          component={Events}
          options={{
            title: "Events",
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name="event"
                size={24}
                color={focused ? "#363852" : "grey"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Youth"
          component={Youth}
          options={{
            title: "Youth",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name="people"
                size={24}
                color={focused ? "#363852" : "grey"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Reports"
          component={Reports}
          options={{
            title: "Report",
            tabBarIcon: ({ color, focused }) => (
              <AntDesign
                name="filetext1"
                size={24}
                color={focused ? "#363852" : "grey"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Attendance"
          component={Attendance}
          options={{
            title: "Attendance",
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6
                name="person-circle-question"
                size={24}
                color={focused ? "#363852" : "grey"}
              />
            ),
          }}
        />
      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#c9ada7",
    borderTopColor: "#c9ada7",
    height: 85,
    paddingBottom: 20, // Adjust for vertical centering
    paddingTop: 5, // Adjust for vertical centering
    paddingHorizontal: 5,
    bottom: 10,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#c9ada7",
    paddingHorizontal: 10,
    paddingBottom: -20,
    borderBottomColor: "#726d81",
  },
  icon: {
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#363852",
    fontFamily: "Cursive", // Make sure you have a creative font loaded
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 15,
    marginRight: 10,
  },
  profileInitials: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#726d81",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  initialsText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
