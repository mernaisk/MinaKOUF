import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from "react-native";
import CheckBox from "react-native-check-box";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getAllDocInCollection,
  getOneDocInCollection,
  updateDocument,
} from "@/firebase/firebaseModel";
import AwesomeAlert from "react-native-awesome-alerts";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import SelectDateControl from "@/components/selectDateControll";
import BackButton from "@/components/BackButton";
import { filterMembers } from "@/scripts/utilities";
import { useChurch } from "@/context/churchContext";
import { useUser } from "@/context/userContext";
import { getMembersInOneChurch } from "@/firebase/firebaseModelMembers";
import { updateAttendenceForMembers } from "@/firebase/firebaseModelAttendence";

type SheetDetailsRouteProp = RouteProp<RootStackParamList, "SheetDetails">;

const EditAttendenceSheet = () => {
  const route = useRoute<SheetDetailsRouteProp>();
  const { sheetId } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [nameToSearch, setNameToSearch] = useState("");

  const {
    control,
    watch,
    reset,
    setValue,
    formState: { isDirty },
  } = useForm<any>({
    defaultValues: {
      Date: {},
      AttendedIDS: [],
      IsSubmitted: null,
    },
  });
  const queryClient = useQueryClient();
  const [isChanged, setIsChanged] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertVisible1, setIsAlertVisible1] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sheetIDS, setSheetIDS] = useState<string[]>([]);
  const { userInfo } = useUser();

  const { data: allMembers, isLoading: allMembersLoading } = useQuery({
    queryFn: () => getMembersInOneChurch(userInfo.OrginizationIdKOUF),
    queryKey: ["allMembers"],
  });

  const { data: sheetDetails, isLoading: sheetDetailsLoading } = useQuery({
    queryFn: () => getOneDocInCollection("Attendence", sheetId),
    queryKey: ["sheetDetails", sheetId],
  });

  useEffect(() => {
    if (sheetDetails) {
      reset({
        Date: sheetDetails.Date || {},
        AttendedIDS: sheetDetails.AttendedIDS || [],
        IsSubmitted: sheetDetails.IsSubmitted || false,
      });
      setSheetIDS(sheetDetails.AttendedIDS);
    }
  }, [sheetDetails, reset]);

  const watchedDate = watch("Date");

  useEffect(() => {
    if (sheetDetails?.AttendedIDS && sheetIDS) {
      const hasIDSChanged =
        sheetDetails?.AttendedIDS.length !== sheetIDS?.length ||
        sheetDetails?.AttendedIDS.some(
          (id: string) => !sheetIDS?.includes(id)
        ) ||
        sheetIDS.some((id: string) => !sheetDetails?.AttendedIDS.includes(id));
      const hasDateChanged =
        sheetDetails?.Date?.dateTime !== watchedDate?.dateTime;

      setIsChanged(hasIDSChanged || hasDateChanged);
    }
  }, [sheetIDS, watchedDate]);

  const mutationUpdate = useMutation({
    mutationFn: (data: string[]) => updateDocument("Attendence", sheetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sheetDetails", sheetId] });
      queryClient.invalidateQueries({ queryKey: ["allAttendenceSheets"] });
    },
    onMutate: () => {
      setIsUpdating(true);
    },
    onError: () => {
      setIsUpdating(false);
    },
    onSettled: () => {
      setIsUpdating(false);
    },
  });

  const mutateUpdateMembersInfo = useMutation({
    mutationFn: async (data: any) => {
      await updateAttendenceForMembers(data, allMembers);
      return updateDocument("Attendence", sheetId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sheetDetails", sheetId] });
      queryClient.invalidateQueries({ queryKey: ["allAttendenceSheets"] });
    },
    onMutate: () => {
      setIsUpdating(true);
    },
    onError: () => {
      setIsUpdating(false);
    },
    onSettled: () => {
      setIsUpdating(false);
      navigation.goBack();
    },
  });

  if (allMembersLoading || sheetDetailsLoading || isUpdating) {
    return (
      <SafeAreaView style={styles.overlay}>
        <ActivityIndicator size="large" color="black" />
      </SafeAreaView>
    );
  }

  const toggleMember = (member: any) => {
    setSheetIDS((prevIDs) =>
      prevIDs.includes(member.Id)
        ? prevIDs.filter((id) => id !== member.Id)
        : [...prevIDs, member.Id]
    );
  };

  const renderMember = ({ item }: { item: any }) => (
    <View key={item.Id} style={styles.memberItem}>
      <Image
        source={{ uri: item.ProfilePicture.URL }}
        style={styles.profileImage}
      />
      <Text style={styles.memberName}>{item.Name}</Text>
      <CheckBox
        isChecked={sheetIDS.includes(item.Id)}
        onClick={() => toggleMember(item)}
      />
    </View>
  );

  const handleBackPress = () => {
    if (isChanged) {
      setIsAlertVisible(true);
    } else {
      navigation.goBack();
    }
  };

  const handleSave = () => {
    setValue("AttendedIDS", sheetIDS);
    mutationUpdate.mutate(watch());
  };

  const handleSubmit = () => {
    setValue("AttendedIDS", sheetIDS);
    setValue("IsSubmitted", true);
    mutateUpdateMembersInfo.mutate(watch());
  };
  const filteredMembers = filterMembers(allMembers, nameToSearch);

  return (
    <SafeAreaView style={styles.container}>
      <BackButton handleBackPress={handleBackPress} />

      <TouchableOpacity
        disabled={!isChanged}
        onPress={handleSave}
        style={[styles.saveButton, !isChanged && styles.disabledSaveButton]}
      >
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <SelectDateControl
        name={"Date"}
        control={control}
        rules={{ required: "Select date and time" }}
        placeholderDate={"Select Date"}
        placeholderTime={"Select Time"}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={nameToSearch}
          onChangeText={setNameToSearch}
          placeholder="Search for name"
          autoCapitalize="words"
          clearButtonMode="while-editing"
          style={styles.input}
          placeholderTextColor="#7d8597"
          enterKeyHint="search"
          inputMode="text"
        />
      </View>
      <FlatList
        data={filteredMembers as any[]}
        keyExtractor={(item) => item.Id}
        renderItem={renderMember}
        style={styles.list}
        ListEmptyComponent={() => (
          <View>
            <Text>No members to display</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => setIsAlertVisible1(true)}
      >
        <Text style={styles.submitButtonText}>Create</Text>
      </TouchableOpacity>

      <AwesomeAlert
        show={isAlertVisible}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave without saving?"
        showCancelButton={true}
        cancelText="Cancel"
        onCancelPressed={() => setIsAlertVisible(false)}
        showConfirmButton={true}
        confirmText="Leave"
        onConfirmPressed={() => {
          setIsAlertVisible(false);
          navigation.goBack();
        }}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      />

      <AwesomeAlert
        show={isAlertVisible1}
        title="Unsaved Changes"
        message="No further changes can be made. Are you sure you want to submit?"
        showCancelButton={true}
        cancelText="Cancel"
        onCancelPressed={() => setIsAlertVisible1(false)}
        showConfirmButton={true}
        confirmText="Submit"
        onConfirmPressed={() => {
          setIsAlertVisible1(false);
          handleSubmit();
        }}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      />
    </SafeAreaView>
  );
};

export default EditAttendenceSheet;

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: "#1F2937", 
    paddingVertical: 15, 
    borderRadius: 8, 
    alignItems: "center", 
    marginTop: 20, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, 
    elevation: 5, 
    width: "90%",
    alignSelf: "center", 
      },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF", 
  },
  list: {
    marginTop: 20,
  },
  container: {
    flex: 1,
    padding: 16,
    // backgroundColor: "#f5f5f5",
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    width: "90%",
    alignSelf: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  memberName: {
    flex: 1,
    fontSize: 18,
  },
  overlay: {
    justifyContent: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  saveButton: {
    position: "absolute",
    top: 70,
    right: "10%",
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    zIndex: 1,
  },
  disabledSaveButton: {
    backgroundColor: "#d3d3d3",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  input: {
    backgroundColor: "#f2e9e4",
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 10, // Add padding to ensure the text doesn't overlap with the icon
    width: "90%", // Specific width
    height: 50, // Specific height
    textAlign: "left", // Center the text
    borderRadius: 10,
    color: "#4a4e69", // Change this to your desired text color
  },
  inputContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
});
