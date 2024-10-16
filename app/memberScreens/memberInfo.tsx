import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOneDocInCollection } from "@/firebase/firebaseModel";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Loading } from "@/components/loading";
import { RootStackParamList } from "@/constants/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { OneMemberInfo } from "@/hooks/OneMemberInfo";

type MemberInfosRouteProp = RouteProp<RootStackParamList, "MemberInfo">;

const MemberInfo = () => {
  // const API_URL = "http://10.58.154.147:5000";

  // const setUserRole = async (uid, role) => {
  //   try {
  //     const response = await fetch(`${API_URL}/setUserRole`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ uid, role }),
  //     });

  //     const result = await response.text();
  //     console.log(result); // Output the response from the server
  //   } catch (error) {
  //     console.error("Error:", error); // Handle any errors
  //   }
  // };
 
  // setUserRole("f4yWkHF6JoP1Nkxv8qf7jKZq4e43", "admin");

  const route = useRoute<MemberInfosRouteProp>();
  const { memberId } = route.params; // Extract the sheetId parameter
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { data: memberInfo, isLoading } = OneMemberInfo(memberId);

  if (isLoading) {
    return <Loading></Loading>;
  }
  console.log(memberInfo);

  function renderMembersTitle() {
    if (memberInfo?.IsActiveInKOUF === "Yes" && memberInfo?.IsActiveInRiksKOUF === "Yes") {
      return (
        <View>
          <Text style={styles.infoText}>{memberInfo?.TitleKOUF} i {memberInfo?.OrginizationNameKOUF} </Text>
          <Text style={styles.infoText}>{memberInfo?.TitleRiksKOUF} i RiksKOUF</Text>
        </View>
      );
    } else if (memberInfo?.IsActiveInKOUF === "No" && memberInfo?.IsActiveInRiksKOUF === "Yes") {
      return (
        <Text style={styles.infoText}>{memberInfo?.TitleRiksKOUF} i RiksKOUF</Text>

      );
    } else if (memberInfo?.IsActiveInKOUF === "Yes" && memberInfo?.IsActiveInRiksKOUF === "No") {
      return (
        <Text style={styles.infoText}>{memberInfo?.TitleKOUF} i {memberInfo?.OrginizationNameKOUF} </Text>
      );
    } else {
      return <Text style={styles.infoText}>Ungdom</Text>
    }
  }

  function server() {
    // setUserRole("f4yWkHF6JoP1Nkxv8qf7jKZq4e43", "admin");
  }


  const renderInvolvments = () => {
    console.log(memberInfo?.Involvments.length);
    if (memberInfo?.Involvments.length > 0) {
      return <Text>{memberInfo?.Involvments.join(",")}</Text>
    } else {
      return <Text>None</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EditMember", { memberId: memberId })
          }
          style={styles.editButton}
        >
          <FontAwesome5 name="user-edit" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.profilePictureContainer}>
          <View style={styles.profilePicture}>
            {memberInfo?.ProfilePicture?.URL ? (
              <Image
                source={{ uri: memberInfo?.ProfilePicture?.URL }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person-circle-outline" size={100} color="#ccc" />
            )}
          </View>
        </View>

        {renderInfoSection("person-outline", "Name", `${memberInfo?.Name}`)}
        {renderInfoSection("mail-outline", "Email", memberInfo?.Email)}
        {renderInfoSection(
          "call-outline",
          "Phone number",
          memberInfo?.PhoneNumber
        )}
        {renderInfoSection(
          "card-outline",
          "Personnummer",
          memberInfo?.PersonalNumber
        )}
        {renderInfoSection(
          "home-outline",
          "Address",
          `${memberInfo?.StreetName}, ${memberInfo?.PostNumber} ${memberInfo?.City}`
        )}

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <MaterialCommunityIcons
              name="hand-heart-outline"
              size={24}
              color="black"
            />
            <Text style={styles.infoHeaderText}>Areas of Interest</Text>
          </View>
          <Text style={styles.infoText}>
            {memberInfo?.Service?.join(",")}.
          </Text>
          <View style={styles.separator} />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <FontAwesome name="group" size={24} color="black" />
            <Text style={styles.infoHeaderText}>My Involvements</Text>
          </View>
          <Text style={styles.infoText}>
            {renderInvolvments()}.
          </Text>
          <View style={styles.separator} />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="church" size={24} color="black" />
            <Text style={styles.infoHeaderText}>Church</Text>
          </View>
          <Text style={styles.infoText}>
            {memberInfo?.Orginization}.
          </Text>
          <View style={styles.separator} />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="category" size={24} color="black" />
            <Text style={styles.infoHeaderText}>Category</Text>
          </View>
          {renderMembersTitle()}
          <View style={styles.separator} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const renderInfoSection = (iconName: any, header: any, info: any) => {
  return (
    <View style={styles.infoSection}>
      <View style={styles.infoHeader}>
        <Ionicons name={iconName} size={24} color="#000" />
        <Text style={styles.infoHeaderText}>{header}</Text>
      </View>
      <Text style={styles.infoText}>{info}</Text>
      <View style={styles.separator} />
    </View>
  );
};

const renderMembersTitle = (member: any) => {
  if (member.Title.Category == "Ungdom") {
    return <Text>Ungdom</Text>;
  } else if (member.Title.Category == "KOUF") {
    return <Text>{member.Title.Title}</Text>;
  }
};

export default MemberInfo;

const styles = StyleSheet.create({
  editButton: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 18,
    color: "#000",
  },
  profilePictureContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  infoHeaderText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
});
