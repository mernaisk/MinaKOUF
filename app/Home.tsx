import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { signOut } from "@/firebase/firebaseModel"; // Import your sign-out function
import { useUser } from "../context/userContext";
import { Loading } from "@/components/loading";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/types";

const Home = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, userInfo, isLoading } = useUser();
  if (isLoading) {
    return <Loading></Loading>;
  }

  function checkAccess() {
    return userInfo?.IsActiveInKOUF === "Yes";
  }
  // bbhuy
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };
  console.log(user)
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>log out</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <TouchableOpacity
          style={[
            styles.memberItem,
            !checkAccess() && styles.disabled
          ]}
          onPress={() => navigation.navigate("KOUFtabs")}
          disabled={!checkAccess()}
        >
          <Text style={styles.buttonText}>KOUF </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.memberItem}
          onPress={() => navigation.navigate("YOUTHtabs")}
        >
          <Text style={styles.buttonText}>Youth</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#decbc6",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
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
  logoutButton: {
    position: "absolute",
    top: 60, // Adjust the top position as needed
    right: 40, // Adjust the right position as needed
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
  },
  disabled: {
    backgroundColor: "#d3d3d3",
  }
});
