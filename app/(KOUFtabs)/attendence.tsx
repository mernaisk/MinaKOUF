import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { getAllDocInCollection } from "@/firebase/firebaseModel";
import { sortDate } from "@/scripts/utilities";
import { Loading } from "@/components/loading";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/types";

const Attendance = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { data: allAttendenceSheets, isLoading } = useQuery({
    queryFn: () => getAllDocInCollection("STMinaKOUFAttendence"),
    queryKey: ["allAttendenceSheets"],
  });
  if (isLoading) {
    return (
      <Loading></Loading>
    );
  }
  const sortedSheets = sortDate(allAttendenceSheets);
  // const navigation = useNavigation()
  const IdsCount = (sheetDetails: any) => {
    return sheetDetails?.IDS ? Object.keys(sheetDetails.IDS).length : 0;
  };

  function datePressed(item:any){
    navigation.navigate("SheetDetails", {sheetId: item?.Id})
  }

  return (
    <SafeAreaView>
      <View>
        <Text>Attendence sheets</Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("CreateAttendenceSheet")}
      >
        <Text>create</Text>
      </TouchableOpacity>

      <View style={styles.hearderContent}>
        <Text style={styles.header}>Date</Text>
        <Text style={styles.header}>amount</Text>
        <Text style={styles.header}>name</Text>
        <Text style={styles.header}>type</Text>
      </View>

      <FlatList
        data={sortedSheets}
        keyExtractor={(item) => item.Id}
        renderItem={({ item }) => (
          
          <View style={styles.row}>
            <TouchableOpacity onPress={() => datePressed(item)} style={styles.cell}>
              <Text>{item.date}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {}} style={styles.cell}>
              <Text>{IdsCount(item)}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {}} style={styles.cell}>
              <Text>{item?.leader?.label}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {}} style={styles.cell}>
              <Text>{item?.type?.label}</Text>
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
};

export default Attendance;

const styles = StyleSheet.create({

  button: {
    marginTop: 10,
    fontSize: 30,
    backgroundColor: "#DDDDDD",
  },
  list: {
    // top: 20,
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontSize: 30,
  },
  hearderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "6AB7E2",
    fontWeight: "bold",
  },
  header: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 4,
    marginVertical: 5,
    elevation: 1,
    borderRadius: 10,
    borderBottomWidth: 3,
    // borderColor: "black",
    padding: 20,
  },
  cell: {
    flex: 1,
    textAlign: "left",
  },
});