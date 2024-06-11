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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { filterMembers } from "../../scripts/utilities";
import { getAllDocInCollection } from "../../firebase/firebaseModel.js";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function youth() {
  const navigation = useNavigation()
  const router = useRouter();
  const [nameToSearch, setNameToSearch] = useState("");

  const navigateToAddMember = () => {
    router.push({pathname: "addMember"})
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
    <SafeAreaView>
      {/* <Button onPress={() => router.push({pathname: "/AddMember"})}>add member</Button> */}
      <TouchableOpacity onPress={navigateToAddMember}>
        <Ionicons
          name="person-add"
          size={50}
          color="black"
          style={styles.iconStyle}
        />
      </TouchableOpacity>

      <TextInput
        placeholder="Search for name"
        value={nameToSearch}
        onChangeText={setNameToSearch}
        autoCapitalize="sentences"
        clearButtonMode="while-editing"
        enterKeyHint="search"
        inputMode="text"
        style={styles.Input}
        numberOfLines={2}
      />

      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.Id}
        renderItem={({ item }) => (
          <View style={styles.button}>
            <TouchableOpacity
            style={styles.button}
              onPress={() =>
                router.push({
                  pathname: "/editMember",
                  params: { memberId: item.Id },
                })
              }
            >
              <Text style={styles.buttonText}>{item.FirstName}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View>
            <Text>No items to display</Text>
          </View>
        )}
        style={styles.list}
      ></FlatList>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    top: 100,
  },
  buttonText:{
    color:"black",
    textAlign:"center",
    fontSize:30
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
  Input: {
    top: 80,
    fontSize: 30,
    backgroundColor: "white",
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 20,
  },
  iconStyle: {
    position: "absolute",
    top: 10,
    right: 10,
    marginBottom: 50,
  },
});
