import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useForm } from "react-hook-form";
import InputController from "../components/InputController.jsx";
import { SafeAreaView } from "react-native-safe-area-context";
import PhoneInputController from "../components/PhoneInputController.jsx";
import {
  serviceOptions,
  titleOptions,
  checkEmail,
  checkPersonalNumber,
} from "../scripts/utilities.js";
import MultiSelectController from "../components/MultiSelectController.jsx";
import OneSelectController from "../components/OneSelectController.jsx";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  getOneDocInCollection,
  updateDocument,
} from "../firebase/firebaseModel.js";
import { useNavigation } from "expo-router";
import AwesomeAlert from "react-native-awesome-alerts";

const editMember = () => {

  const { memberId } = useLocalSearchParams();
  const [memberINFO, setMemberINFO] =useState({});

  const queryClient = useQueryClient();

  const { data: memberInfo, isLoading,isSuccess } = useQuery({
    queryFn: () => getOneDocInCollection("STMinaKOUFData", memberId),
    queryKey: ["memberInfo", memberId],
  },
);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty, touchedFields },
  } = useForm({
    defaultValues: {
      FirstName:  "",
      LastName:  "",
      PersonalNumber: "",
      PhoneNumber: "",
      StreetName: "",
      PostNumber: "",
      city: "",
      Email: "",
      Title: "",
      Service: "",
    },
  });
  

  const navigation = useNavigation();

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const mutationUpdate = useMutation({
    mutationFn: (data) => updateDocument("STMinaKOUFData", memberId, data),
    onError: (error) => {
      console.error("Error updating document:", error);
    },
    onSuccess: (data:any) => {
      reset(data); 
      queryClient.refetchQueries();
    },
  });

  const handleBackPress = () => {
    if (isDirty) {
      setIsAlertVisible(true);
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (isSuccess && memberInfo) {
      reset({
        FirstName: memberInfo.FirstName || "",
        LastName: memberInfo.LastName || "",
        PersonalNumber: memberInfo.PersonalNumber || "",
        PhoneNumber: memberInfo.PhoneNumber || "",
        StreetName: memberInfo.StreetName || "",
        PostNumber: memberInfo.PostNumber || "",
        city: memberInfo.city || "",
        Email: memberInfo.Email || "",
        Title: memberInfo.Title || "",
        Service: memberInfo.Service || "",
      });
    }
  }, [isSuccess, memberInfo]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  const onSubmit = (data: any) => {
    console.log("button is pressed");
    mutationUpdate.mutate(data);
  };
  console.log(isDirty);
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={handleBackPress}>
        <Text>Back</Text>
      </TouchableOpacity>

      <TouchableOpacity disabled={!isDirty} onPress={handleSubmit(onSubmit)}>
        <Text>save</Text>
      </TouchableOpacity>

      <InputController
        name="FirstName"
        control={control}
        rules={{
          required: "First name is required.",
          pattern: {
            value: /^[a-zA-ZöäåÖÄÅ\s]+$/,
            message: "This input is letters only.",
          },
          maxLength: {
            value: 12,
            message: "This input exceed maxLength.",
          },
        }}
        placeholder="First Name"
      />

      <InputController
        name="LastName"
        control={control}
        rules={{
          required: "Last name is required.",
          pattern: {
            value: /^[a-zA-ZöäåÖÄÅ\s]+$/,
            message: "This input is letters only.",
          },
          maxLength: {
            value: 12,
            message: "This input exceed maxLength.",
          },
        }}
        placeholder="Last Name"
      />

      <InputController
        name="PersonalNumber"
        control={control}
        rules={{
          required: "Personal number is required.",
          validate: (value: any) => {
            const result = checkPersonalNumber(value);
            return result.boolean ? true : result.message;
          },
        }}
        placeholder="YYYYMMDD-XXXX"
      />

      <InputController
        name="PhoneNumber"
        control={control}
        rules={{
          required: "phone number is required.",
        }}
        placeholder="Phone number (ex. +46739352363)"
      />

      <InputController
        name="StreetName"
        control={control}
        rules={{
          required: "Street name is required.",
          pattern: {
            value: /^[a-zA-ZöäåÖÄÅ\s\d]+$/,
            message: "letters, digits and spaces only. inga symboler",
          },
        }}
        placeholder="Street Name"
      />

      <InputController
        name="PostNumber"
        control={control}
        rules={{
          required: "Post number is required.",
          pattern: {
            value: /\d{5}/,
            message: "Invalid post number. It should be 5 digits.",
          },
        }}
        placeholder="Post number"
      />

      <InputController
        name="city"
        control={control}
        rules={{
          required: "City is required.",
          pattern: {
            value: /^[a-zA-ZöäåÖÄÅ\s]+$/,
            message: "letters only.",
          },
        }}
        placeholder="City"
      />

      <InputController
        name="Email"
        control={control}
        rules={{
          required: "Email is required.",
          validate: (value: any) => checkEmail(value) || "Invalid email.",
        }}
        placeholder="Email"
      />


      <OneSelectController
        name="Title"
        control={control}
        rules={{
          required: "Title is required.",
        }}
        data={titleOptions}
        placeholder="Choose title"
      />

      <MultiSelectController
        name="Service"
        control={control}
        rules={{
          required: "Service is required.",
          validate: (data: any) => {
            console.log(data);
            return true;
          },
        }}
        data={serviceOptions}
        placeholder="Choose Service"
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

export default editMember;

const styles = StyleSheet.create({});