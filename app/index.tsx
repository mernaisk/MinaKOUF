import React from "react";
import { Button, View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Link, useRouter } from "expo-router"; // or the router library you're using
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter(); // or use the appropriate hook for your router library

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <TouchableOpacity style={styles.memberItem}>
        <Text style={styles.buttonText}>Log in </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.memberItem}
        onPress={() => router.push({ pathname: "memberScreens/addMember" })}
      > 
        {/* <Link href="memberScreens/addMember"> */}
        <Text style={styles.buttonText}>Create Account </Text>
        {/* </Link> */}
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
    width: "70%", // Set the item width to 90% of the screen width
    alignSelf: "center", // Center the item horizontally
  },

  buttonText: {
    flex: 1,
    color: "black",
    textAlign: "center",
    // alignItems:'center',
    fontSize: 30,
  },
});
