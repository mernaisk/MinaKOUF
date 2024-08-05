import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native"; // Use the correct hook for navigation
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "@/constants/types";

export default function Index() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <TouchableOpacity
        style={styles.memberItem}
        onPress={() => navigation.navigate("LogIn")}
      >
        <Text style={styles.buttonText}>Log in </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.memberItem}
        onPress={() => navigation.navigate("AddMember")} // Corrected the screen name to match the defined name
      >
        <Text style={styles.buttonText}>New member </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2e9e4",
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#726d81",
    width: "70%", // Set the item width to 70% of the screen width
    alignSelf: "center", // Center the item horizontally
  },

  buttonText: {
    flex: 1,
    color: "black",
    textAlign: "center",
    fontSize: 30,
  },
});
