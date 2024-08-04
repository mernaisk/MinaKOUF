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
  import * as ImagePicker from "expo-image-picker";
  import { router } from "expo-router";
  import { useQuery } from "@tanstack/react-query";
  import { getAllDocInCollection } from "@/firebase/firebaseModel";
  import { sortDate } from "@/scripts/utilities";
  
  const Events = () => {
    const {
      data: allEvents,
      isLoading,
      isSuccess,
    } = useQuery({
      queryFn: () => getAllDocInCollection("STMinaKOUFEvents"),
      queryKey: ["allEvents"],
    });
  
    if (isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      );
    }
  
    const sortedEvents = sortDate(allEvents);
    const renderItem = ({ item }) => (
      <View>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "eventScreens/eventInfo",
              params: { eventId: item.Id },
            })
          }
        >
          <Text>{item.Title}</Text>
          <Image
            source={{ uri: item?.ImageInfo?.URL }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    );
  
    return (
      <SafeAreaView>
        <Text style={styles.titleContainer}>events</Text>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "eventScreens/createEvent" })}
        >
          <Text>create new event</Text>
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
        />
      </SafeAreaView>
    );
  };
  
  export default Events;
  
  const styles = StyleSheet.create({
    headerImage: {
      color: "#808080",
      bottom: -90,
      left: -35,
      position: "absolute",
    },
    titleContainer: {
      flexDirection: "row",
      gap: 20,
      marginLeft: 20,
      color: "black",
    },
    loading: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    imagePreview: {
      width: 300,
      height: 300,
      marginTop: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ccc",
    },
  });
  