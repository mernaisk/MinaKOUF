import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  calculateMonthlyAttendance,
  sortAttendanceByDate,
  sortDate,
} from "@/scripts/utilities";
import { Loading } from "@/components/loading";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList, SheetInfo } from "@/constants/types";
import { CircularProgressBase } from "react-native-circular-progress-indicator";
import { AllAttendenceSheets } from "@/hooks/AllAttendenceSheets";
import { MembersInOneChurch } from "@/hooks/MembersInOneChurch";

const Attendance = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { data: allAttendenceSheetsData, isLoading: AttendenceIsLoading } =
    AllAttendenceSheets();
  const { data: allMembers, isLoading: MembersIsLoading } =
    MembersInOneChurch();
  const allAttendenceSheets = (allAttendenceSheetsData ?? []) as SheetInfo[];

  const sortedSheets = sortAttendanceByDate(allAttendenceSheets);

  function datePressed(item: any) {
    navigation.navigate("SheetDetails", { sheetId: item?.Id });
  }

  const totalMembers = allMembers?.length || 0;
  const monthPercentages = calculateMonthlyAttendance(
    sortedSheets,
    totalMembers
  );
  console.log(monthPercentages);
  const hasUnsubmittedSheets = sortedSheets.some((sheet) => !sheet.IsSubmitted);

  const quarters = [
    { months: ["Jan", "Feb", "Mar"], data: monthPercentages.slice(0, 3) },
    { months: ["Apr", "May", "Jun"], data: monthPercentages.slice(3, 6) },
    { months: ["Jul", "Aug", "Sep"], data: monthPercentages.slice(6, 9) },
    { months: ["Oct", "Nov", "Dec"], data: monthPercentages.slice(9, 12) },
  ];

  const circularProps = {
    activeStrokeWidth: 20,
    inActiveStrokeWidth: 15,
    inActiveStrokeOpacity: 0.2,
  };
  const createNewSheet =() => {
    if(hasUnsubmittedSheets){
      Alert.alert("You have one unsumbmitted sheet. It is with white background! Please submit it before starting a new one")
    }
    else{
      navigation.navigate("CreateAttendenceSheet")

    }
  }
  if (AttendenceIsLoading || MembersIsLoading) {
    return <Loading />;
  }
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={createNewSheet}
      >
        <Text style={styles.logoutButtonText}>New Attendance Sheet</Text>
      </TouchableOpacity>

      <View style={styles.progressSection}>
        {quarters.map((quarter, index) => (
          <View key={index} style={styles.quarterContainer}>
            <CircularProgressBase
              {...circularProps}
              value={quarter.data[0]?.percentage || 0}
              radius={75}
              activeStrokeColor={"#e84118"}
              inActiveStrokeColor={"#e84118"}
            >
              <CircularProgressBase
                {...circularProps}
                value={quarter.data[1]?.percentage || 0}
                radius={50}
                activeStrokeColor={"#badc58"}
                inActiveStrokeColor={"#badc58"}
              >
                <CircularProgressBase
                  {...circularProps}
                  value={quarter.data[2]?.percentage || 0}
                  radius={25}
                  activeStrokeColor={"#18dcff"}
                  inActiveStrokeColor={"#18dcff"}
                />
              </CircularProgressBase>
            </CircularProgressBase>
            <View style={styles.quarterText}>
              {quarter.months.map((month, idx) => (
                <Text key={idx} style={styles.monthText}>
                  <Text style={{ color: getColor(idx) }}>{month}</Text>:{" "}
                  {quarter.data[idx]?.percentage || 0}%
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.header}>Date</Text>
        <Text style={styles.header}>Amount</Text>
      </View>

      {sortedSheets.length > 0 ? (
        sortedSheets.map((item: SheetInfo) => (
          <View
            key={item.Id}
            style={[
              styles.row,
              item.IsSubmitted ? styles.submittedRow : styles.notSubmittedRow, // Conditionally apply styles
            ]}
          >
            <TouchableOpacity
              onPress={() => datePressed(item)}
              style={styles.cell}
            >
              <Text style={styles.cellText}>{item.Date.justDate}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {}} style={styles.cell}>
              <Text style={styles.cellText}>
                {item?.AttendedIDS ? Object.keys(item.AttendedIDS).length : 0}
              </Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View>
          <Text>No items to display</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Attendance;

const getColor = (index: number) => {
  const colors = ["#e84118", "#badc58", "#18dcff"];
  return colors[index];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#decbc6",
  },
  logoutButton: {
    position: "absolute",
    top: 30,
    right: "5%",
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 20,
  },
  notSubmittedRow: {
    backgroundColor: "white", 
  },
  submittedRow: {
    backgroundColor: "#ccffcc", 
  },
  progressSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 90,
  },
  quarterContainer: {
    alignItems: "center",
    width: "45%",
    marginBottom: 20,
  },
  quarterText: {
    marginTop: 10,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  tableHeader: {
    width: "90%", // Ensure it takes up 90% of the width
    alignSelf: "center", // Center the table
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "grey",
    borderRadius: 8,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row: {
    width: "90%", // Ensure it takes up 90% of the width
    alignSelf: "center", // Center the table rows
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 5,
    elevation: 2,
  },
  header: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },

  cell: {
    flex: 1,
    textAlign: "center",
  },
  cellText: {
    textAlign: "center",
    fontSize: 14,
  },
});
