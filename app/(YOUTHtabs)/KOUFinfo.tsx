import { FlatList, StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
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

  return (
    <SafeAreaView>
      <FlatList
        data={leaders}
        renderItem={(leader: any) => (
          <View>
            <Image
              source={leader?.profilePicture?.url}
              style={styles.imagePreview}
              resizeMode="cover"
            />
            <View><Text>{leader.FirstName} {leader.LastName}</Text></View>
            <View><Text>{leader.Title}</Text></View>
            <View><Text>{leader.PhoneNumber}</Text></View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default KOUFinfo;

const styles = StyleSheet.create({
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
