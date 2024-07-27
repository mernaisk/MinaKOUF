import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { getOneDocInCollection } from "@/firebase/firebaseModel";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const MemberInfo = () => {
  const { memberId } = useLocalSearchParams();
  const { data: memberInfo, isLoading } = useQuery({
    queryFn: () => getOneDocInCollection("STMinaKOUFData", memberId),
    queryKey: ["memberInfo", memberId],
  });

  const navigation = useNavigation();
  const router = useRouter();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

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
            router.push({
              pathname: "/editMember",
              params: { memberId: memberId },
            })
          }
          style={styles.editButton}
        >
          <FontAwesome5 name="user-edit" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.profilePictureContainer}>
          <View style={styles.profilePicture}>
            {memberInfo?.ProfilePicture?.uri ? (
              <Image
                source={{ uri: memberInfo?.ProfilePicture?.uri }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person-circle-outline" size={100} color="#ccc" />
            )}
          </View>
        </View>

        {renderInfoSection(
          "person-outline",
          "Name",
          `${memberInfo?.Name}`
        )}
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
          `${memberInfo?.StreetName}, ${memberInfo?.PostNumber} ${memberInfo?.city}`
        )}
        {renderInfoSection(
          "lock-closed-outline",
          "Password",
          memberInfo?.Password
        )}
        {renderInfoSection(
          "list-outline",
          "Interested services",
          memberInfo?.Service?.join(", ")
        )}
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
