import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import { FontAwesome6 } from '@expo/vector-icons';
const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'black', // Active tab color
        tabBarInactiveTintColor: 'gray', // Inactive tab color
        tabBarLabelStyle: {
          fontSize: 14, // Adjust as needed
          fontWeight: 'bold', // Adjust as needed
        },
      }}>
      <Tabs.Screen
        name="YOUTHindex"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
          <FontAwesome5 name="home" size={24} color={focused? "black": "grey"} />          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          headerTitleStyle:{color:"black", fontSize: 30},
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="event" size={24} color={focused? "black": "grey"} />)
        }}
      />

      <Tabs.Screen
        name="taranim"
        options={{
          title: 'Taranim',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="filetext1" size={24} color={focused? "black" : "grey"} />)        
        }}
      />

      <Tabs.Screen
        name="KOUFinfo"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
          <FontAwesome6 name="person-circle-question" size={24} color={focused? "black":"grey"} />)}}
      />


    </Tabs>
  )
}

export default _layout

