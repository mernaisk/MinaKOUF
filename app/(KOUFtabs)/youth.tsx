import {
  StyleSheet,
  Text,
  ActivityIndicator,
  Button,
  TextInput,
  FlatList,
  View,
  Alert,
  TouchableOpacity,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { filterMembers } from "../../scripts/utilities";
import { getAllDocInCollection } from "../../firebase/firebaseModel.js";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import ScreenWrapper from "../../components/ScreenWrapper";

export default function youth() {
  const navigation = useNavigation();
  const router = useRouter();
  const [nameToSearch, setNameToSearch] = useState("");

  const navigateToAddMember = () => {
    router.push({ pathname: "addMember" });
  };

  const { data: allMembers, isLoading } = useQuery({
    queryFn: () => getAllDocInCollection("STMinaKOUFData"),
    queryKey: ["allMembers"],
  });
  if (isLoading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  const filteredMembers = filterMembers(allMembers, nameToSearch);
  return (
    <ScreenWrapper>
      {/* <TouchableOpacity onPress={navigateToAddMember}>
        <Ionicons
          name="person-add"
          size={50}
          color="black"
          style={styles.iconStyle}
        />
      </TouchableOpacity> */}


      <View style={styles.inputContainer}>

      <TextInput
        value={nameToSearch}
        onChangeText={setNameToSearch}
        placeholder="Search for name"
        autoCapitalize="words"
        clearButtonMode="while-editing"
        style={styles.input}
        placeholderTextColor="#7d8597"
        enterKeyHint="search"
        inputMode="text"
      />
      </View>

      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.Id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.memberItem}
            onPress={() =>
              router.push({
                pathname: "/memberInfo",
                params: { memberId: item.Id },
              })
            }
          >
            <Image
              source={{ uri: item.ProfilePicture.uri || 'https://via.placeholder.com/50' }} // Use the actual profile picture URL
              style={styles.profilePicture}
            />
            <Text style={styles.memberName}>{item.Name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View>
            <Text>No items to display</Text>
          </View>
        )}
        style={styles.list}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  list: {
    // top: 100,
    width: "100%", // Ensure the list takes up the full width
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
    width: "90%", // Set the item width to 90% of the screen width
    alignSelf: "center", // Center the item horizontally
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25, // Make the image circular
    marginRight: 15,
  },
  memberName: {
    fontSize: 20,
    color: "black",
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontSize: 30,
  },
  button: {
    marginTop: 10,
    fontSize: 30,
    backgroundColor: "#DDDDDD",
  },
  Container: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#f2e9e4",
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 10, // Add padding to ensure the text doesn't overlap with the icon
    width: "90%", // Specific width
    height: 50, // Specific height
    textAlign: "left", // Center the text
    borderRadius: 10,
    color: "#4a4e69", // Change this to your desired text color

  },
  iconStyle: {
    position: "absolute",
    top: 10,
    right: 10,
    marginBottom: 50,
  },
  inputContainer: {
    // position: "relative",
    marginTop: 20,
    width: "100%",
    alignItems: "center", // Center the content horizontally
  },
});
