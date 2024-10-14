import {
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState } from "react";
import { filterMembers } from "../../scripts/utilities";
import ScreenWrapper from "../ScreenWrapper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/types";
import { MembersInOneChurch } from "@/hooks/MembersInOneChurch";
import { Loading } from "@/components/loading";

export default function Youth() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [nameToSearch, setNameToSearch] = useState("");

  const { data: allMembers, isLoading } = MembersInOneChurch();
  if (isLoading) {
    return <Loading/>;
  }
  const getInitials = (name: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };
  const filteredMembers = filterMembers(allMembers, nameToSearch);
  console.log(filteredMembers);
  return (
    <ScreenWrapper>
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
              navigation.navigate("MemberInfo", { memberId: item?.Id })
            }
          >
            {item?.ProfilePicture?.URL ? (
              <Image
                source={{ uri: item?.ProfilePicture?.URL }}
                style={styles.profilePicture}
              />
            ) : (
              <View style={styles.profileInitials}>
                <Text style={styles.initialsText}>
                  {getInitials(item.Name)}
                </Text>
              </View>
            )}

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
    width: "100%",
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
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  initialsText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileInitials: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#726d81",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});
