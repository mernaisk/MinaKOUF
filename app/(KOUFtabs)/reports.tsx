import {
  Alert,
  Button,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Loading } from "@/components/loading";
import { MemberInfo, SheetInfo } from "@/constants/types";
import { MembersInOneChurch } from "@/hooks/MembersInOneChurch";
import { AllAttendenceSheets } from "@/hooks/AllAttendenceSheets";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";
import MultiSelectController from "@/components/MultiSelectController";
import {
  membersOptions,
  months,
  MonthsWithNumber,
  serviceOptions,
} from "@/scripts/utilities";
import { useForm } from "react-hook-form";
import { generatePDF } from "@/scripts/generatePDF";
import { sortAlphapidically } from "@/scripts/utilities";
import { sortAttendanceByDate } from "@/scripts/utilities";
import { sortMembersByAbsence } from "@/scripts/utilities";
import { leadersOptions } from "@/scripts/utilities";
import { LeadersInOneChurch } from "@/hooks/LeadersInOneChurch";
import OneSelectController from "@/components/OneSelectController";

const Reports = () => {
  const { control: controlMembers, handleSubmit: handleSubmit1 } = useForm({
    defaultValues: {
      MembersInfoOptions: [],
    },
  });

  const { control: controlBirthday, handleSubmit: handleSubmit2 } = useForm({
    defaultValues: {
      pickedMonths: [],
    },
  });

  const { control: controlLeaders, handleSubmit: handleSubmit3 } = useForm({
    defaultValues: {
      LeadersInfoOptions: [],
    },
  });

  const { control: controlService, handleSubmit: handleSubmit4 } = useForm({
    defaultValues: {
      ChoosenService: "",
      ChoosenCategory: "",
    },
  });

  const { data: allMembers, isLoading: membersIsLoading } =
    MembersInOneChurch();
  const { data: attendanceData, isLoading: AttendenceIsLoading } =
    AllAttendenceSheets();
  const { data: Leaders, isLoading: LeadersIsLoading } = LeadersInOneChurch();

  if (membersIsLoading || AttendenceIsLoading || LeadersIsLoading) {
    return <Loading />;
  }

  const handleGenerateBirthdayPDF = (month: any) => {
    let monthsNumber: Array<string> = [];

    month?.pickedMonths.forEach((month: string) => {
      const monthNumber =
        MonthsWithNumber[month as keyof typeof MonthsWithNumber];
      if (monthNumber) {
        monthsNumber.push(monthNumber);
      }
    });

    if (allMembers) {
      const headers = [["Name", "Year", "Month", "Day", "Phone"]];

      const data = sortAlphapidically(
        allMembers?.filter((member: MemberInfo) => {
          const birthMonth = member.PersonalNumber?.substring(4, 6);
          return monthsNumber.includes(birthMonth);
        })
      ).map((member: MemberInfo) => [
        member.Name || "N/A",
        member.PersonalNumber?.substring(0, 4) || "N/A",
        member.PersonalNumber?.substring(4, 6) || "N/A",
        member.PersonalNumber?.substring(6, 8) || "N/A",
        member.PhoneNumber || "N/A",
      ]);

      generatePDF(
        "birthdays",
        headers,
        data,
        `Birthday Report for Month ${month.pickedMonths.join(",")}`
      );
    }
  };

  const handleGenerateMembersPDF = async (formData: any) => {
    const allMembersSorted = await sortAlphapidically(allMembers);
    const selectedFields = formData.MembersInfoOptions;
    const headers = [selectedFields];

    const data = allMembersSorted?.map((member: MemberInfo) => {
      return selectedFields.map((field: string) => {
        switch (field) {
          case "Namn":
            return member.Name || "N/A";
          case "Personnummer":
            return member.PersonalNumber || "N/A";
          case "Epost":
            return member.Email || "N/A";
          case "Telefonnumber":
            return member.PhoneNumber || "N/A";
          case "Adress":
            return (
              member.StreetName +
                ", " +
                member.PostNumber +
                " " +
                member.City || "N/A"
            );
          case "Tjänster":
            return member.Involvments.join(", ") || "N/A"; // Assuming "Services" is an array of services
          default:
            return "N/A";
        }
      });
    });

    generatePDF("members", headers, data, "Members List");
  };

  const handleGenerateAttendancePDF = () => {
    if (allMembers && attendanceData) {
      const sortedAttendance = sortAttendanceByDate(attendanceData);
      const headers = [["Date", "Attended", "Absence", "Procent"]];
      const data = sortedAttendance?.map((sheet: SheetInfo) => [
        sheet.Date.justDate || "N/A",
        sheet.AttendedIDS.length || "N/A",
        allMembers?.length - sheet.AttendedIDS.length || "N/A",

        ((sheet.AttendedIDS.length / allMembers?.length) * 100).toFixed() ||
          "N/A",
      ]);
      generatePDF("attendance", headers, data, "Attendance Report");
    }
  };

  const handleGenerateMembersAttendancePDF = () => {
    if (allMembers && attendanceData) {
      const SortedMembers = sortMembersByAbsence(allMembers);
      const headers = [
        [
          "Name",
          "Phone number",
          "Absence in row",
          "Absence this year",
          "Attendence this year",
        ],
      ];
      const data = SortedMembers?.map((member: MemberInfo) => [
        member.Name || "N/A",
        member.PhoneNumber || "N/A",
        member.Attendence.LastWeekAttendend || "N/A",
        member.Attendence.CountAbsenceCurrentYear || "N/A",
        member.Attendence.CountAttendenceCurrentYear || "N/A",
      ]);
      generatePDF("attendance", headers, data, "Attendance Report");
    }
  };

  const handleGenerateLeadersInfoPDF = (formData: any) => {
    if (Leaders && formData.LeadersInfoOptions) {
      const SortedMembers = sortAlphapidically(Leaders);
      const selectedFields = formData.LeadersInfoOptions;

      const headers = [selectedFields];

      const data = SortedMembers?.map((member: MemberInfo) => {
        return selectedFields.map((field: string) => {
          switch (field) {
            case "Namn":
              return member.Name || "N/A";
            case "Personnummer":
              return member.PersonalNumber || "N/A";
            case "Epost":
              return member.Email || "N/A";
            case "Telefonnumber":
              return member.PhoneNumber || "N/A";
            case "Adress":
              return (
                member.StreetName +
                  ", " +
                  member.PostNumber +
                  " " +
                  member.City || "N/A"
              );
            case "Title":
              return member.TitleKOUF || "N/A";
            default:
              return "N/A";
          }
        });
      });
      generatePDF("Leaders", headers, data, "Leaders Report");
    }
  };

  const handleGenerateServicePDF = (month: any) => {
    let monthsNumber: Array<string> = [];

    month?.pickedMonths.forEach((month: string) => {
      const monthNumber =
        MonthsWithNumber[month as keyof typeof MonthsWithNumber];
      if (monthNumber) {
        monthsNumber.push(monthNumber);
      }
    });

    if (allMembers) {
      const headers = [["Name", "Year", "Month", "Day", "Phone"]];

      const data = sortAlphapidically(
        allMembers?.filter((member: MemberInfo) => {
          const birthMonth = member.PersonalNumber?.substring(4, 6);
          return monthsNumber.includes(birthMonth);
        })
      ).map((member: MemberInfo) => [
        member.Name || "N/A",
        member.PersonalNumber?.substring(0, 4) || "N/A",
        member.PersonalNumber?.substring(4, 6) || "N/A",
        member.PersonalNumber?.substring(6, 8) || "N/A",
        member.PhoneNumber || "N/A",
      ]);

      generatePDF(
        "birthdays",
        headers,
        data,
        `Birthday Report for Month ${month.pickedMonths.join(",")}`
      );
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {/* members info */}
        <Collapse>
          <CollapseHeader>
            <View style={styles.headerContainer}>
              <View style={styles.iconContainer}>
                <FontAwesome6 name="people-roof" size={24} color="white" />
              </View>
              <Text style={styles.headerTitle}>Members</Text>
              <FontAwesome5 name="arrow-down" size={24} color="white" />
            </View>
          </CollapseHeader>
          <CollapseBody>
            <MultiSelectController
              control={controlMembers}
              name="MembersInfoOptions"
              rules={{ required: "Please select at least one option." }}
              items={membersOptions}
              title="Which info do you want?"
              disabled={false}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleSubmit1(handleGenerateMembersPDF)}
            >
              <Text style={styles.addButtonText}>Download</Text>
            </TouchableOpacity>
          </CollapseBody>
        </Collapse>

        {/* members birthday */}
        <Collapse>
          <CollapseHeader>
            <View style={styles.headerContainer}>
              <View style={styles.iconContainer}>
                <FontAwesome name="birthday-cake" size={24} color="white" />
              </View>
              <Text style={styles.headerTitle}>Birthday</Text>
              <FontAwesome5 name="arrow-down" size={24} color="white" />
            </View>
          </CollapseHeader>
          <CollapseBody>
            <MultiSelectController
              control={controlBirthday}
              name="pickedMonths"
              rules={{ required: "Please select at least one month." }}
              items={months}
              title="Which months do you want?"
              disabled={false}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleSubmit2(handleGenerateBirthdayPDF)}
            >
              <Text style={styles.addButtonText}>Download</Text>
            </TouchableOpacity>
          </CollapseBody>
        </Collapse>

        {/* Attendence */}
        <Collapse>
          <CollapseHeader>
            <View style={styles.headerContainer}>
              <View style={styles.iconContainer}>
                <FontAwesome6
                  name="person-circle-question"
                  size={24}
                  color="white"
                />
              </View>
              <Text style={styles.headerTitle}>Attendence</Text>
              <FontAwesome5 name="arrow-down" size={24} color="white" />
            </View>
          </CollapseHeader>
          <CollapseBody>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleGenerateAttendancePDF}
            >
              <Text style={styles.addButtonText}>
                Download attendnece sheets
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleGenerateMembersAttendancePDF}
            >
              <Text style={styles.addButtonText}>
                Download attendence for members
              </Text>
            </TouchableOpacity>
          </CollapseBody>
        </Collapse>

        {/* KOUF ledears */}
        <Collapse>
          <CollapseHeader>
            <View style={styles.headerContainer}>
              <View style={styles.iconContainer}>
                <FontAwesome6 name="people-group" size={24} color="white" />
              </View>
              <Text style={styles.headerTitle}>Leaders</Text>
              <FontAwesome5 name="arrow-down" size={24} color="white" />
            </View>
          </CollapseHeader>
          <CollapseBody>
            <MultiSelectController
              control={controlLeaders}
              name="LeadersInfoOptions"
              rules={{ required: "Please select at least one option." }}
              items={leadersOptions}
              title="Which info do you want?"
              disabled={false}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleSubmit3(handleGenerateLeadersInfoPDF)}
            >
              <Text style={styles.addButtonText}>Download</Text>
            </TouchableOpacity>
          </CollapseBody>
        </Collapse>

        {/* service */}
        <Collapse>
          <CollapseHeader>
            <View style={styles.headerContainer}>
              <View style={styles.iconContainer}>
                <FontAwesome6 name="people-pulling" size={24} color="white" />
              </View>
              <Text style={styles.headerTitle}>Service</Text>
              <FontAwesome5 name="arrow-down" size={24} color="white" />
            </View>
          </CollapseHeader>
          <CollapseBody>
            <OneSelectController
              control={controlService}
              name="ChoosenService"
              rules={{ required: "Please select at least one option." }}
              items={serviceOptions}
              title="Which info do you want?"
              disabled={false}
            />
            <OneSelectController
              control={controlService}
              name="ChoosenCategory"
              rules={{ required: "Please select at least one option." }}
              items={[
                { Name: "Involved", Id: "Involved", Disabled: false },
                { Name: "Interested", Id: "Interested", Disabled: false },
              ]}
              title="Which info do you want?"
              disabled={false}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleSubmit4(handleGenerateLeadersInfoPDF)}
            >
              <Text style={styles.addButtonText}>Download</Text>
            </TouchableOpacity>
          </CollapseBody>
        </Collapse>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Reports;

const styles = StyleSheet.create({
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flexWrap: "wrap",
  },
  addButton: {
    backgroundColor: "#4a4e69",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "70%",
    borderRadius: 10,
    marginBottom: 50,
    alignSelf: "center",
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#4a4e69",
    borderRadius: 10,
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
  },
  iconContainer: {
    paddingRight: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // Title color
  },
  arrowIcon: {
    paddingLeft: 10,
  },
});

//Events
