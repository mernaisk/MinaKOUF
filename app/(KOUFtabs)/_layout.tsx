import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Link, Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FontAwesome6 } from "@expo/vector-icons";

// Custom Header Component
const CustomHeader = () => (
  <View style={headerStyles.container}>
    <Link href="/index">
      <MaterialIcons
        name="church"
        size={45}
        color="#363852"
        style={headerStyles.icon}
      />
    </Link>
    <Text style={headerStyles.title}>St: Mina KOUF</Text>
    <Image
      source={{ uri: "https://via.placeholder.com/30" }} // Replace with actual user profile picture URI
      style={headerStyles.profilePicture}
    />
  </View>
);

export default function TabLayout() {
  const { width } = Dimensions.get("window");
  const tabBarWidth = width * 0.95;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
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
      <Tabs.Screen
        name="KOUFindex"
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
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          headerTitleStyle: { color: "black", fontSize: 30 },
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="event"
              size={24}
              color={focused ? "#363852" : "grey"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="youth"
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
      <Tabs.Screen
        name="reports"
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
      <Tabs.Screen
        name="attendence"
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
    </Tabs>
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
    // paddingVertical: 50,
    paddingTop: 60,
    paddingBottom: 10,
    // marginTop: 60,
    // borderBottomWidth: 3,
    borderBottomColor: "#726d81",
    // borderBottomLeftRadius:-30
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
});
