import { Image, ActivityIndicator, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { getOneDocInCollection } from "@/firebase/firebaseModel";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Fontisto from "@expo/vector-icons/Fontisto";
import { RootStackParamList } from "@/constants/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";

type EventsDetailsRouteProp = RouteProp<RootStackParamList, "EventInfo">;

const EventInfo = () => {
  const route = useRoute<EventsDetailsRouteProp>();
  const { eventId } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  console.log(eventId);
  const { data: eventInfo, isLoading } = useQuery({
    queryFn: () => getOneDocInCollection("Events", eventId),
    queryKey: ["EventInfo", eventId],
  });

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  const renderDates = () => {
    const { StartDate, EndDate } = eventInfo;
    if (StartDate.justDate === EndDate.justDate) {
      return (
        <View style={styles.item}>
          <Fontisto name="date" size={24} style={styles.icon} />
          <Text>{StartDate.justDate}</Text>
          <Fontisto name="clock" size={24} style={styles.icon} />
          <Text>{`${StartDate.justTime} - ${EndDate.justTime}`}</Text>
        </View>
      );
    } else {
      return (
        <>
          <View style={styles.item}>
            <Fontisto name="date" size={24} style={styles.icon} />
            <Text>{`Start: ${StartDate.dateTime}`}</Text>
          </View>
          <View style={styles.item}>
            <Fontisto name="date" size={24} style={styles.icon} />
            <Text>{`End: ${EndDate.dateTime}`}</Text>
          </View>
        </>
      );
    }
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => navigation.navigate("EditEvent", {eventId:eventId})}>
        <Text>Edit</Text>
      </TouchableOpacity>
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

      {renderDates()}
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
    minHeight: 24,
  },
  icon: {
    color: "black",
    marginHorizontal: 10,
    height: 24,
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
