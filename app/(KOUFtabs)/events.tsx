import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";

import { sortDate } from "@/scripts/utilities";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { EventInfo, RootStackParamList } from "@/constants/types";
import { AllEvents } from "@/hooks/AllEvents";
import { Loading } from "@/components/loading";
import { useUser } from "@/context/userContext";

const Events = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { userInfo } = useUser();

  const { data: allEvents, isLoading } = AllEvents();

  if (isLoading) {
    return <Loading />;
  }

  const queryClient = useQueryClient();
  const sortedEvents = sortDate(allEvents);

  function navigateToCreateEvent() {
    queryClient.invalidateQueries({ queryKey: ["church"] });
    navigation.navigate("CreateEvent", {
      EventChurch: userInfo.OrginizationNameKOUF,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={navigateToCreateEvent}
      >
        <Text style={styles.logoutButtonText}>Create new event</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollContainer}>
        {sortedEvents.length > 0 ? (
          sortedEvents.map((item: EventInfo) => (
            <View key={item.Id} style={styles.eventBox}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("EventInfo", { eventId: item.Id })
                }
              >
                <Text style={styles.eventTitle}>{item.Title}</Text>
                <Image
                  source={{ uri: item?.ImageInfo?.URL }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View>
            <Text>No items to display</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Events;

const styles = StyleSheet.create({
  scrollContainer: {
    marginTop: 10,
    paddingBottom: 20, 
  },
  container: {
    padding: 20,
    backgroundColor: "#f8f8f8",
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
    width: "100%",
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
