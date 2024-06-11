import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const events = () => {
  return (
    <SafeAreaView>
      <Text style={styles.titleContainer}>events</Text>
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