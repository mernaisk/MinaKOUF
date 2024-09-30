import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import React from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDocoment } from "@/firebase/firebaseModel";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/types";
import SelectDateControl from "@/components/selectDateControll";


const CreateAttendenceSheet = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const queryClient = useQueryClient();
  const mutationAdd = useMutation<any, unknown, any>({
    mutationFn: (data) => addDocoment("Attendence", data),

    onError: (error) => {
      console.error("Error updating document:", error);
    },
    onSuccess: () => {
      queryClient.refetchQueries();
      navigation.goBack();
    },
  });

  const onSubmit = (data: { [key: string]: any }) => {
    data.AttendedIDS = [];
    data.IsSubmitted= false;
    mutationAdd.mutate(data);
  };

  const { control, handleSubmit } = useForm();

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Create Attendance Sheet</Text>
        <Image source={require("../../assets/images/attendence.png")} style={styles.headerImage} />
      </View>

      <View style={styles.formContainer}>
        <SelectDateControl
          name={"Date"}
          control={control}
          rules={{
            required: "Select date and time",
          }}
          placeholderDate={"Select Date"}
          placeholderTime={"Select Time"}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submitButtonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateAttendenceSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 70,
  },
  headerImage: {
    width: 200, 
    height: 300,
    resizeMode: "contain", 
    
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  formContainer: {
    flex: 1,
  },
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
});
