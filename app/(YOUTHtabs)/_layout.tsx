import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FontAwesome6 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { getOneDocInCollection } from "@/firebase/firebaseModel";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loading } from "@/components/loading";
import { useUser } from "@/context/userContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Events from "./events";
import Taranim from "./taranim";
import KOUFinfo from "./KOUFinfo";
import YOUTHindex from "./YOUTHindex";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/types";

const Tab = createBottomTabNavigator();
function CustomHeader() {
  const { user, userInfo } = useUser();
  const getInitials = (name: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();


  return (
    <View style={headerStyles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
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
        {userInfo?.ProfilePicture?.URL ? (
          <Image
            source={{
              uri: userInfo?.ProfilePicture?.URL,
            }} 
            style={headerStyles.profilePicture}
          />
        ) : (
          <View style={headerStyles.profileInitials}>
            <Text style={headerStyles.initialsText}>
              {getInitials(userInfo?.Name)}
            </Text>
          </View>        )}
      </TouchableOpacity>
    </View>
  );
}
const YOUTHTabLayout = () => {
  const { width } = Dimensions.get("window");
  const tabBarWidth = width * 0.95;
  return (
    <Tab.Navigator
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
      <Tab.Screen
        name="YOUTHindex"
        component={YOUTHindex}
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              name="home"
              size={24}
              color={focused ? "black" : "grey"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={Events}
        options={{
          title: "Events",
          headerTitleStyle: { color: "black", fontSize: 30 },
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="event"
              size={24}
              color={focused ? "black" : "grey"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Taranim"
        component={Taranim}
        options={{
          title: "Taranim",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign
              name="filetext1"
              size={24}
              color={focused ? "black" : "grey"}
            />
          ),
        }}
      />

      <Tab.Screen
        name="KOUFinfo"
        component={KOUFinfo}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6
              name="person-circle-question"
              size={24}
              color={focused ? "black" : "grey"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default YOUTHTabLayout;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#c9ada7",
    borderTopColor: "#c9ada7",
    height: 85,
    paddingBottom: 20,
    paddingTop: 5, 
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
    paddingTop: 60,
    paddingBottom: 10,
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
