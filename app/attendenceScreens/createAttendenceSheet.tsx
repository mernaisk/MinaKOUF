import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm, Controller } from "react-hook-form";
import InputController from "@/components/InputController";
import OneSelectController from "@/components/OneSelectController";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addDocoment, getKOUFAnsvariga } from "@/firebase/firebaseModel";
import { getLeadersNames, attendenceOptions } from "@/scripts/utilities";
import { router, useNavigation, useRouter } from "expo-router";
// import DatePicker from 'react-native-date-picker'
// import { useNavigation } from "@react-navigation/native"; // Use the correct hook for navigation

const CreateAttendenceSheet = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shownDate, setShowenDate] = useState("");
  const [isPickerShowen, setIsPickerShowen] = useState(false);
  const {data: leaders, isLoading} = useQuery({
    queryFn: () => getKOUFAnsvariga(),
    queryKey: ["leaders"]
  })
  const queryClient = useQueryClient()
  const navigation = useNavigation()

  //react query
// import { useNavigation } from "@react-navigation/native"; // Use the correct hook for navigation

  const mutationAdd = useMutation<any, unknown, any>({
    mutationFn: (data) => addDocoment('STMinaKOUFAttendence', data),

    onError: (error) => {
      console.error('Error updating document:', error);
    },
    onSuccess: () => {
      queryClient.refetchQueries();
      navigation.goBack();
    }
  });

  console.log("leaders are", leaders)
  
  const onSubmit = (data: { [key: string]: any }) => {
    data.IDS = [];
    console.log(data);
    mutationAdd.mutate(data);
  };

  const { control, handleSubmit, reset, getValues } = useForm({
    defaultValues: {
      date: "",
      leader: "",
      type: "",
    },
  });



  //select date
  function toggleIsPickerShown() {
    setIsPickerShowen(!isPickerShowen);
  }

  const onChange = ({ type }: any, selectedDate: any) => {
    if (type == "set") {
      // toggleIsPickerShown();
      setSelectedDate(selectedDate);
      if (Platform.OS === "android") {
        toggleIsPickerShown();
        setShowenDate(selectedDate.toDateString());
      }
    } else {
      toggleIsPickerShown();
    }
  };

  useEffect(() => {

    if (shownDate) {
      const currentValues = getValues();
      reset({
        ...currentValues,
        date: shownDate || "",
      });
    }
  }, [shownDate]);

  const renderDateInput = () => {
    if (Platform.OS === "android") {
      return (
        <Pressable onPress={toggleIsPickerShown}>
          <InputController
            name="date"
            control={control}
            rules={{
              required: "Date is required.",
            }}
            placeholder={"selectedDate"}
            editable={false}
          />
        </Pressable>
      );
    }

    if (Platform.OS === "ios") {
        return (
            <InputController
              name="date"
              control={control}
              rules={{
                required: "Date is required.",
              }}
              placeholder={"selectedDate"}
              editable={false}
              onPressIn={toggleIsPickerShown}
            />
        );
      }
  };

  return (
    <SafeAreaView>
      <Text>createAttendenceSheet</Text>
      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <Text>Create</Text>
      </TouchableOpacity>

      {renderDateInput()}

      <OneSelectController
        name="leader"
        control={control}
        rules={{
          required: "Title is required.",
        }}
        data={getLeadersNames(leaders)}
        placeholder="created by"
      />

      <OneSelectController
        name="type"
        control={control}
        rules={{
          required: "type is required.",
        }}
        data={attendenceOptions}
        placeholder="Choose type"
      />

      {isPickerShowen && (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={selectedDate}
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}

      {isPickerShowen && Platform.OS === "ios" && (
        <View style={styles.buttonsView}>
          <TouchableOpacity
            style={styles.pickerButtons}
            onPress={toggleIsPickerShown}
          >
            <Text style={styles.buttonText}>cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pickerButtons}
            onPress={() =>{
                toggleIsPickerShown();
                setShowenDate(selectedDate.toDateString());
            }}
          >
            <Text style={styles.buttonText}>confirm</Text>
          </TouchableOpacity>
        </View>
      )}
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
