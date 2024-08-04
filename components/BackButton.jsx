import { StyleSheet, Text, View,TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const BackButton = ({handleBackPress}) => {

  return (
    <View>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={30} color="#000" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backButtonText: {
    marginLeft: 5,
    fontSize: 20,
    color: "#000",
  },
  backButton: {
    marginLeft:20,
    flexDirection: "row",
    alignItems: "center",
  },
});
