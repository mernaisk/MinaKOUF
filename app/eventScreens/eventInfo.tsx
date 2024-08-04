import { Image, ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { getOneDocInCollection } from "@/firebase/firebaseModel";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Fontisto from "@expo/vector-icons/Fontisto";

const EventInfo = () => {
  // const { eventId } = useLocalSearchParams();
  const eventId ="WMyNtfFUls0NqUgnP4y8"
  console.log(eventId);
  const { data: eventInfo, isLoading } = useQuery({
    queryFn: () => getOneDocInCollection("STMinaKOUFEvents", eventId),
    queryKey: ["EventInfo", eventId],
  });
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }
  console.log(eventInfo?.imageInfo?.uri);
  return (
    // <SafeAreaView>
    //   <Text>event info</Text>
    // </SafeAreaView>
    <SafeAreaView>
      <View>
        <Text style={styles.title}>{eventInfo?.Title}</Text>
      </View>

      <Image
        source={{ uri: eventInfo?.ImageInfo?.URL }}
        style={styles.imagePreview}
        resizeMode="cover"
      />

      <View style={styles.item}>
        <MaterialIcons name="place" size={24} style={styles.icon} />
        <Text style={styles.text}>{eventInfo?.Place}</Text>
      </View>

      <View style={styles.item}>
        <Ionicons name="pricetag" size={24} style={styles.icon} />
        <Text>{eventInfo?.Price}</Text>
      </View>

      <View style={styles.item}>
        <FontAwesome5 name="info" size={24} style={styles.icon} />
        <Text>{eventInfo?.Info}</Text>
      </View>

      <View style={styles.item}>
        <Fontisto name="date" size={24} style={styles.icon} />
        <Text>{eventInfo?.Date}</Text>
      </View>
    </SafeAreaView>
  );
};

export default EventInfo;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: 400,
    height: 400,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    alignSelf: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    minHeight: 24, // or the maximum height of your icons
  },

  icon: {
    color: "black",
    marginHorizontal: 10,
    height: 24, // or the maximum height of your icons
    textAlignVertical: "center",
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginVertical: 20,
  },
});
