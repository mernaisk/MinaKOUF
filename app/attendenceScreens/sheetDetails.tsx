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
import { getOneDocInCollection } from "@/firebase/firebaseModel";
import { DocumentData } from "firebase/firestore";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import CircularProgress from "react-native-circular-progress-indicator";
import BackButton from "@/components/BackButton";
import { MembersInOneChurch } from "@/hooks/MembersInOneChurch";
import { Loading } from "@/components/loading";
import { OneSheetInfo } from "@/hooks/OneSheetInfo";

type SheetDetailsRouteProp = RouteProp<RootStackParamList, "SheetDetails">;

const SheetDetails = () => {
  const route = useRoute<SheetDetailsRouteProp>();
  const { sheetId } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { data: allMembers, isLoading: MembersIsLoading } =
    MembersInOneChurch();

  const { data: sheetDetails, isLoading: isSheetLoading } =
    OneSheetInfo(sheetId);

  if (isSheetLoading || MembersIsLoading) {
    return <Loading />;
  }

  const attendedIdsCount = sheetDetails?.AttendedIDS
    ? Object.keys(sheetDetails.AttendedIDS).length
    : 0;
  const totalMembersCount = allMembers ? Object.keys(allMembers).length : 0;
  const attendancePercentage = (
    (attendedIdsCount / totalMembersCount) *
    100
  ).toFixed(2);

  const handleBackPress = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bar}>
        <BackButton handleBackPress={handleBackPress} />
        {!sheetDetails?.IsSubmitted && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("EditAttendenceSheet", { sheetId })
            }
          >
            <FontAwesome5 name="user-edit" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.headerContainer}>
        <View style={styles.headerTextInfo}>
          <Text style={styles.headerText}>
            Date: {sheetDetails?.Date.dateTime}
          </Text>
          <Text style={styles.headerText}>
            Attended: {attendedIdsCount} / {totalMembersCount}
          </Text>
        </View>

        <CircularProgress
          value={parseFloat(attendancePercentage)}
          radius={90}
          valueSuffix="%"
          inActiveStrokeColor="#e0e0e0"
          activeStrokeColor="#6AB7E2"
          inActiveStrokeOpacity={0.5}
          progressValueStyle={styles.progressText}
          circleBackgroundColor="#fff"
          duration={1000}
        />
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.header}>Name</Text>

        <Text style={styles.header}>Sequential Absences</Text>
        <Text style={styles.header}>Yearly Attendance</Text>
      </View>

      <FlatList
        data={allMembers}
        keyExtractor={(item) => item.Id}
        renderItem={({ item }) => {
          const attendedThisYear =
            parseInt(item.Attendence?.CountAttendenceCurrentYear, 10) || 0;
          const missedThisYear =
            parseInt(item.Attendence?.CountAbsenceCurrentYear, 10) || 0;
          const missedInRow =
            parseInt(item.Attendence?.LastWeekAttendend, 10) || 0;
          return (
            <View style={styles.row}>
              {/* Pressable Name */}
              <TouchableOpacity
                style={styles.cell}
                onPress={() =>
                  navigation.navigate("MemberInfo", { memberId: item.Id })
                }
              >
                <Text style={styles.pressableName}>{item.Name}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cell}>
                {}
                {sheetDetails?.AttendedIDS.includes(item.Id) ? (
                  <Ionicons name="checkmark-circle" size={30} color="green" />
                ) : (
                  <Ionicons name="close-circle" size={30} color="red" />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cell}>
                {!sheetDetails?.IsSubmitted ? (
                  sheetDetails?.AttendedIDS.includes(item.Id) ? (
                    <Text>0</Text>
                  ) : (
                    <Text>{missedInRow + 1}</Text>
                  )
                ) : (
                  <Text>{missedInRow}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.cell}>
                {!sheetDetails?.IsSubmitted ? (
                  sheetDetails?.AttendedIDS.includes(item.Id) ? (
                    <View style={styles.stats}>
                      <Text>Attended: {attendedThisYear + 1}</Text>
                      <Text>Missed: {missedThisYear}</Text>
                    </View>
                  ) : (
                    <View style={styles.stats}>
                      <Text>Attended: {attendedThisYear}</Text>
                      <Text>Missed: {missedThisYear + 1}</Text>
                    </View>
                  )
                ) : (
                  <View style={styles.stats}>
                    <Text>Attended: {attendedThisYear}</Text>
                    <Text>Missed: {missedThisYear}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <View>
            <Text>No items to display</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default SheetDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#9a8c98",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    padding: 10,
    backgroundColor: "grey",
    borderRadius: 8,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "grey",
    borderRadius: 8,
    marginBottom: 5,
  },
  header: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 5,
    elevation: 2,
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  pressableName: {
    color: "#6AB7E2",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  stats: {
    flex: 1,
    textAlign: "center",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  editButton: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 1,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  headerContainer: {
    // marginVertical: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTextInfo: {
    paddingVertical: 10,
    backgroundColor: "grey",
    borderRadius: 8,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  progressText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#6AB7E2",
  },
  bar: {
    marginBottom: 40,
  },
});
