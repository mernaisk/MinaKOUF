import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Platform,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllDocInCollection,
  getOneDocInCollection,
  updateDocument,
} from "@/firebase/firebaseModel";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import InputController from "@/components/InputController";
import DateTimePicker from "@react-native-community/datetimepicker";
import AwesomeAlert from "react-native-awesome-alerts";
import { Loading } from "@/components/loading";
import { EventInfo, RootStackParamList } from "@/constants/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";
import BackButton from "@/components/BackButton";
import SelectDateControl from "@/components/selectDateControll";
import dayjs from "dayjs";
import ImagePickerControl from "@/components/ImagePickerControl";

type EventsDetailsRouteProp = RouteProp<RootStackParamList, "EventInfo">;

const EditEvent = () => {
  //   const { eventId } = useLocalSearchParams();
  // const eventId = "dQXbEYYWa7Jy2nerdC93";
  const route = useRoute<EventsDetailsRouteProp>();
  const { eventId } = route.params; // Extract the sheetId parameter
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { data: churchNames, isLoading } = useQuery({
    queryFn: () => getAllDocInCollection("Churchs"),
    queryKey: ["churchs"],
  });
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const queryClient = useQueryClient();

  const eventInfo = queryClient.getQueryData<EventInfo>([
    "memberInfo",
    memberId,
  ]);

  const [isUpdating, setIsUpdating] = useState(false);
  async function refetch() {
    await queryClient.refetchQueries();
  }
  // const {
  //   data: eventInfo,
  //   isLoading,
  //   isSuccess,
  // } = useQuery({
  //   queryFn: () => getOneDocInCollection("Events", eventId),
  //   queryKey: ["eventInfo"],
  // });
  const updateEventInfoMutation = useMutation({
    mutationFn: (data) => updateDocument("Events", eventId, data),
    onError: (error) => {
      setIsUpdating(false);
      console.error("Error updating document:", error);
    },
    onSuccess: (data: any) => {
      // reset(data);
      refetch();
      setIsUpdating(false);
      navigation.goBack();
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    getValues,
    setValue,
    clearErrors,
    setError,
  } = useForm({
    defaultValues: {
      Title: "",
      Place: "",
      Info: "",
      Price: "",
      StartDate: {},
      EndDate:{},
      ImageInfo: {},
    },
  });

  function handleBackPress() {
    navigation.goBack();
  }

  if (isLoading) {
    return <Loading></Loading>;
  }

  const onSubmit = (data: any) => {
    // console.log("button is pressed");
    setIsUpdating(true);
    updateEventInfoMutation.mutate(data);
  };


  return (
    <SafeAreaView>
      <BackButton handleBackPress={handleBackPress}></BackButton>
      <TouchableOpacity disabled={!isDirty} onPress={handleSubmit(onSubmit)}>
        <Text>save</Text>
      </TouchableOpacity>

      {/* <ImagePickerControl
        name="ImageInfo"
        control={control}
        rules={{
          required: "Image is required.",
        }}
      /> */}
      <InputController
        name="Title"
        control={control}
        rules={{
          required: "Title is required.",
          pattern: {
            value: /^[a-zA-ZöäåÖÄÅ\s]+$/,
            message: "This input is letters only.",
          },
        }}
        placeholder="Title"
        secureTextEntry={false}
      />

      <InputController
        name="Place"
        control={control}
        rules={{
          required: "Place name is required.",
          pattern: {
            value: /^[a-zA-ZöäåÖÄÅ\s]+$/,
            message: "This input is letters only.",
          },
        }}
        placeholder="Place name"
        secureTextEntry={false}
      />

      <InputController
        name="Info"
        control={control}
        rules={{
          required: false,
        }}
        placeholder="Info"
        secureTextEntry={false}
      />

      <InputController
        name="Price"
        control={control}
        rules={{
          required: "Price is required.",
          pattern: {
            value: /\d/,
            message: "Digits only",
          },
        }}
        placeholder="Price"
        secureTextEntry={false}
        keyboardType="phone-pad"
      />

      <SelectDateControl
        name="StartDate"
        control={control}
        rules={{
          required: " Start Date and time is required.",
        }}
        placeholderDate={"Start Date"}
        placeholderTime={"Start Time"}
        minDate={dayjs().toDate()}
      />

      <SelectDateControl
        name="EndDate"
        control={control}
        rules={{
          required: " End Date and time is required.",
        }}
        placeholderDate={"End Date"}
        placeholderTime={"End Time"}
        minDate={dayjs().toDate()}
      />
    </SafeAreaView>
  );
};

export default EditEvent;

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
  imagePreview: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
