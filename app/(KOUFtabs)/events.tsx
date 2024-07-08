import { View, Text,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from "expo-image-picker"
import { router } from 'expo-router'

const events = () => {
  return (
    <SafeAreaView>
      <Text style={styles.titleContainer}>events</Text>
      <TouchableOpacity onPress={() => router.push({pathname:"/createEvent"})}><Text>create new event</Text></TouchableOpacity>
    </SafeAreaView>
  )
}

export default events


const styles = StyleSheet.create({
    headerImage: {
      color: '#808080',
      bottom: -90,
      left: -35,
      position: 'absolute',
    },
    titleContainer: {
      flexDirection: 'row',
      gap: 20,
      marginLeft:20,
      color: "black",
    },
  });