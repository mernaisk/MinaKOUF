import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import {
  getOneDocInCollection,
  getAttendedMembers,
} from "@/firebase/firebaseModel";
import { DocumentData } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";

type SheetDetailsRouteProp = RouteProp<RootStackParamList, "SheetDetails">;

const SheetDetails = () => {
  const { control, handleSubmit } = useForm();
  const route = useRoute<SheetDetailsRouteProp>();
  const { sheetId } = route.params; // Extract the sheetId parameter
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {
    data: sheetDetails,
    isLoading: isSheetLoading,
    isError: isSheetError,
  } = useQuery<DocumentData | undefined>({
    queryFn: () => getOneDocInCollection("STMinaKOUFAttendence", sheetId),
    queryKey: ["sheetDetails", sheetId], // Include sheetId in queryKey for proper invalidation
    enabled: !!sheetId, // Ensure the query runs only if sheetId is defined
  });

  const {
    data: attendedMembers,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useQuery({
    queryFn: () => getAttendedMembers(sheetId),
    queryKey: ["attendedMembers", sheetId],
    enabled: !!sheetId, // Ensure the query runs only if sheetId is defined
  });

  if (isSheetLoading || isMembersLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  const IdsCount = sheetDetails?.IDS ? Object.keys(sheetDetails.IDS).length : 0;
  return (
    <SafeAreaView>
      <View>
        <Text>Date: {sheetDetails?.date}</Text>
      </View>

      <View>
        <Text>Amount attended youth: {IdsCount}</Text>
      </View>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("EditAttendenceSheet", { sheetId: sheetId })
        }
      >
        <Text>Edit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SheetDetails;

const styles = StyleSheet.create({
  loading: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    justifyContent: "center",
    alignItems: "center",
  },
});
