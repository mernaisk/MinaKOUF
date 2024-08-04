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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
})