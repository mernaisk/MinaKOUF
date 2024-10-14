import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const KOUFinfo = () => {




  const renderItem = ({ item }:any) => (
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
  // console.log(leaders);
  return (
    <SafeAreaView>
      {/* <FlatList
        data={leaders}
        keyExtractor={(item) => item.Id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View>
            <Text>No items to display</Text>
          </View>
        )}
      /> */}
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
