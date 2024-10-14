import { Text, StyleSheet, View, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'

export function Loading() {
  
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    )
  
}

const styles = StyleSheet.create({
  loadingOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})