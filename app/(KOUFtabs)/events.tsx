import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllDocInCollection } from "@/firebase/firebaseModel";
import { sortDate } from "@/scripts/utilities";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { EventInfo, RootStackParamList } from "@/constants/types";
import { useChurch } from "@/context/churchContext";
const Events = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {churchName} = useChurch()
  const {
    data: allEvents,
    isLoading,
  } = useQuery({
    queryFn: () => getAllDocInCollection("Events"),
    queryKey: ["allEvents"],
  });

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }
  const queryClient = useQueryClient()
  const sortedEvents = sortDate(allEvents);
  const renderItem = ({ item }: { item: EventInfo }) => (
    <View style={styles.eventBox}>
      <TouchableOpacity
        onPress={() => navigation.navigate("EventInfo", { eventId: item.Id })}
      >
        <Text style={styles.eventTitle}>{item.Title}</Text>
        <Image
          source={{ uri: item?.ImageInfo?.URL }}
          style={styles.imagePreview}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
  function navigateToCreateEvent(){
    queryClient.invalidateQueries({ queryKey: ["church"] })
    navigation.navigate("CreateEvent", { EventChurch: churchName })
  }
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={ navigateToCreateEvent}>
        <Text style={styles.logoutButtonText}>Create new event</Text>
      </TouchableOpacity>
      <FlatList
        data={sortedEvents}
        keyExtractor={(item) => item.Id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View>
            <Text>No items to display</Text>
          </View>
        )}
        style={styles.listStyling}
      />
    </SafeAreaView>
  );
};

export default Events;

const styles = StyleSheet.create({
  listStyling:{
    marginTop:10
  },
  container: {
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  eventBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  logoutButton: {
    position: "absolute",
    top: "5%", // Adjust the top position as needed
    right: "5%", // Adjust the right position as needed
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 20,
  },
});
