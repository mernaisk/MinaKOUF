import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { getAllDocInCollection } from "@/firebase/firebaseModel";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/types";
import BackButton from "@/components/BackButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Loading } from "@/components/loading";

const Churchs = () => {

  let allOrg: any= [];
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { data: AllChurchs, isLoading: isLoading} = useQuery({
    queryFn: () => getAllDocInCollection("Churchs"),
    queryKey: ["churchs"],
  });
  const { data: RiksKOUFInfo, isLoading: isLoading2 } = useQuery({
    queryFn: () => getAllDocInCollection("RiksKOUFInfo"),
    queryKey: ["RiksKOUFInfo"],
  });

  function handleBackPress() {
    navigation.goBack();
  }

  if (isLoading || isLoading2) {
    return <Loading />;
  }
  const allChurchesData = Array.isArray(AllChurchs) ? AllChurchs : [];
  const riksKOUFData = Array.isArray(RiksKOUFInfo) ? RiksKOUFInfo : [];

  allOrg = [...allChurchesData, ...riksKOUFData];

  console.log(allOrg)


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <BackButton handleBackPress={handleBackPress} />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddChurch")}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Church</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={allOrg}
        keyExtractor={(item:any) => item.Name}
        renderItem={({ item }:any) => (
          <View style={styles.memberItem}>
            <View style={styles.headerRow}>
              <MaterialIcons
                name="church"
                size={50}
                color="#363852"
                style={styles.churchIcon}
              />
              <Text style={styles.nameText}>{item.Name}</Text>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.detailRow}>
                <View style={styles.iconContainer}>
                  <FontAwesome name="map-marker" size={20} color="#4a4e69" />
                </View>
                <Text style={styles.detailsText}>
                  {item.StreetName}, {item.PostNumber} {item.City}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="payment" size={20} color="black" />
                </View>
                <Text style={styles.detailsText}>{item.SwishNumber}</Text>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.iconContainer}>
                  <FontAwesome name="bank" size={20} color="#4a4e69" />
                </View>

                <Text style={styles.detailsText}>{item.BankgiroNumber}</Text>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.iconContainer}>
                  <FontAwesome name="building" size={20} color="#4a4e69" />
                </View>

                <Text style={styles.detailsText}>{item.OrganisationNr}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Churchs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f5",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4a4e69",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
  memberItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row", // Icon and name in one row
    alignItems: "center", // Vertically center the name with the icon
    // justifyContent: "center", // Horizontally center the icon and name
  },

  churchIcon: {
    marginRight: 10,
  },

  infoContainer: {
    flexDirection: "column", // Ensure details are stacked vertically
    alignItems: "flex-start", // Align all text to the left
    marginTop: 10, // Add space between name and details
  },

  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#363852",
    textAlign: "center", // Center the name
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginHorizontal: 10,
  },
  iconContainer: {
    width: 30, // Fixed width for the icon container to ensure alignment
    alignItems: "center", // Center the icon inside the container
  },
  detailsText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});
