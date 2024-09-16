import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addDocoment, getKOUFAnsvariga } from "@/firebase/firebaseModel";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/types";
import OneSelectController from "@/components/OneSelectController";
import SelectDateControl from "@/components/selectDateControll";
import { Loading } from "@/components/loading";

const CreateAttendenceSheet = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { data: leaders, isLoading } = useQuery({
    queryFn: () => getKOUFAnsvariga(),
    queryKey: ["leaders"],
  });
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

  console.log("leaders are", leaders);

  const onSubmit = (data: { [key: string]: any }) => {
    data.IDS = [];
    console.log(data);
    mutationAdd.mutate(data);
  };

  const { control, handleSubmit, watch } = useForm({
    defaultValues:{
      Leader: ""
    }
  });

  //select date
  if(isLoading){
    return <Loading></Loading>
  }

  console.log(watch())
  return (
    <SafeAreaView>
      <Text>createAttendenceSheet</Text>
      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <Text>Create</Text>
      </TouchableOpacity>

      {/* <OneSelectController
              control={control}
              name="Leader"
              rules={{ required: "Please select at least one leader." }}
              items={leaders}
              title="Which leader is creating the attendencesheet"
      /> */}
      


    </SafeAreaView>
  );
};

export default CreateAttendenceSheet;

const styles = StyleSheet.create({
  buttonsView: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  pickerButtons: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#11182711",
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#075985",
  },
});
