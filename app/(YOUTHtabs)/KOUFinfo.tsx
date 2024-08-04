import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { getKOUFAnsvariga } from "@/firebase/firebaseModel";

const KOUFinfo = () => {
  const { data: leaders, isLoading } = useQuery({
    queryFn: () => getKOUFAnsvariga(),
    queryKey: ["leaders"],
  });

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View>
      <Image
        source={{ uri: item?.ProfilePicture?.URL }}
        style={styles.imagePreview}
        resizeMode="cover"
      />
      <View>
        <Text>{item.Name}</Text>
      </View>
      <View>
        <Text>{item.Title}</Text>
      </View>
      <View>
        <Text>{item.PhoneNumber}</Text>
      </View>
    </View>
  );
  console.log(leaders);
  return (
    <SafeAreaView>
      <FlatList
        data={leaders}
        keyExtractor={(item) => item.Id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View>
            <Text>No items to display</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default KOUFinfo;

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
  imagePreview: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
