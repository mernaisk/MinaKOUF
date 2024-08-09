import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getAllDocInCollection,
  getOneDocInCollection,
  addIDToAttendence,
  removeIDFromAttendence,
  updateDocument,
} from "@/firebase/firebaseModel";
import AwesomeAlert from "react-native-awesome-alerts";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";

type SheetDetailsRouteProp = RouteProp<RootStackParamList, "SheetDetails">;

const EditAttendenceSheet = () => {
  const route = useRoute<SheetDetailsRouteProp>();
  const { sheetId } = route.params; // Extract the sheetId parameter
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const queryClient = useQueryClient();
  const [isChanged, setIsChanged] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // State for tracking mutationUpdate state
  const [sheetIDS, setSheetIDS] = useState<string[]>([]); // Initialize as empty array

  // Fetch all members
  const { data: allMembers, isLoading: allMembersLoading } = useQuery({
    queryFn: () => getAllDocInCollection("Members"),
    queryKey: ["allMembers"],
  });

  const { data: sheetDetails, isLoading: sheetDetailsLoading } = useQuery({
    queryFn: () => getOneDocInCollection("Attendence", sheetId),
    queryKey: ["sheetDetails", sheetId],
  });

  useEffect(() => {
    if (sheetDetails?.IDS) {
      setSheetIDS(sheetDetails.IDS);
    }
  }, [sheetDetails]);

  useEffect(() => {
    if (sheetDetails?.IDS && sheetIDS) {
      const hasChanged =
        sheetDetails?.IDS.length !== sheetIDS?.length ||
        sheetDetails?.IDS.some((id: string) => !sheetIDS?.includes(id)) ||
        sheetIDS.some((id: string) => !sheetDetails?.IDS.includes(id));

      setIsChanged(hasChanged);
      console.log("has changed is: ", hasChanged);
      console.log("sheetDetails is: ", sheetDetails?.IDS);
      console.log("sheetIDS is: ", sheetIDS);
    }
  }, [sheetIDS, sheetDetails]);

  const mutationAdd = useMutation({
    mutationFn: (data) => addIDToAttendence(sheetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sheetDetails", sheetId] });
    },
  });

  const mutationRemove = useMutation({
    mutationFn: (data) => removeIDFromAttendence(sheetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sheetDetails", sheetId] });
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: string[]) =>
      updateDocument("Attendence", sheetId, { IDS: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sheetDetails", sheetId] });
      queryClient.invalidateQueries({ queryKey: ["allAttendenceSheets"] });

    },
    onMutate: () => {
      setIsUpdating(true); // Set isUpdating to true when mutation starts
    },
    onError: () => {
      setIsUpdating(false); // Set isUpdating to false on mutation error
    },
    onSettled: () => {
      setIsUpdating(false); // Set isUpdating to false when mutation completes (whether success or error)
    },
  });

  if (allMembersLoading || sheetDetailsLoading || isUpdating) {
    return (
        <SafeAreaView style={styles.overlay}><ActivityIndicator  size="large" color="black" /></SafeAreaView>
        

    );
  }

  // Function to add member ID to sheetIDS
  const addID = (member: any) => {
    console.log("member will be added: ", member);
    setSheetIDS((prevIDs) => [...prevIDs, member.Id]);
    // mutationAdd.mutate(member.Id);
  };

  // Function to delete member ID from sheetIDS
  const deleteID = (member: any) => {
    setSheetIDS((prevIDs) => prevIDs.filter((id) => id !== member.Id));
    // mutationRemove.mutate(member.Id);
  };

  // Render individual member
  const renderMember = ({ item }: { item: any }) => (
    <View key={item.Id} style={styles.item}>
      {sheetIDS?.includes(item.Id) ? (
        <TouchableOpacity onPress={() => deleteID(item)}>
          <AntDesign name="delete" style={styles.iconDelete} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => addID(item)}>
          <MaterialIcons name="add-circle-outline" style={styles.iconAdd} />
        </TouchableOpacity>
      )}
      <Text style={styles.text}>
        {item.Name}
      </Text>
    </View>
  );

  console.log("sheetDetails", sheetDetails);

  const handleBackPress = () => {
    if (isChanged) {
      setIsAlertVisible(true);
    } else {
      navigation.goBack();
    }
  };

  const handleSave = () => {
    if (sheetIDS) {
      mutationUpdate.mutate(sheetIDS);
    }
  };

  // Render the list of members
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={handleBackPress}>
        <Text>Back</Text>
      </TouchableOpacity>

      <TouchableOpacity disabled={!isChanged} onPress={handleSave}>
        <Text>Save</Text>
      </TouchableOpacity>

      <FlatList
        data={allMembers as any[]} // Type assertion to inform TypeScript that allMembers is an array
        keyExtractor={(item) => item.Id}
        renderItem={renderMember}
        ListEmptyComponent={() => (
          <View>
            <Text>No items to display</Text>
          </View>
        )}
      />


      <AwesomeAlert
        show={isAlertVisible}
        title="Unsaved Changes"
        titleStyle={{ fontSize: 28, color: "black" }}
        message="You have unsaved changes. Are you sure you want to leave without saving?"
        messageStyle={{ color: "grey", fontSize: 20 }}
        showCancelButton={true}
        cancelText="Cancel"
        cancelButtonStyle={{ backgroundColor: "black" }}
        cancelButtonTextStyle={{ color: "grey" }}
        onCancelPressed={() => {
          setIsAlertVisible(false);
        }}
        showConfirmButton={true}
        confirmText="Leave"
        confirmButtonStyle={{ backgroundColor: "black" }}
        confirmButtonTextStyle={{ color: "grey" }}
        onConfirmPressed={() => {
          setIsAlertVisible(false);
          navigation.goBack();
        }}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      />
    </SafeAreaView>
  );
};

export default EditAttendenceSheet;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    marginVertical: 5,
  },
  iconAdd: {
    fontSize: 30,
    color: "blue",
  },
  iconDelete: {
    fontSize: 30,
    color: "red",
  },
  text: {
    fontSize: 25,
    marginLeft: 5,
  },
  overlay: {
    justifyContent: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",  },
});
