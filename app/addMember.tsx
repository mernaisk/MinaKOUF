import { ActivityIndicator, StyleSheet, TouchableOpacity, Text, View, KeyboardAvoidingView, ScrollView,Platform, TextInput  } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useForm } from "react-hook-form";
import InputController from '../components/InputController.jsx';
import {
  serviceOptions,
  titleOptions,
  checkEmail,
  checkPersonalNumber,
} from "../scripts/utilities.js";
import MultiSelectController from "../components/MultiSelectController.jsx";
import OneSelectController from "../components/OneSelectController.jsx";
import { useMutation, useQueryClient ,InvalidateQueryFilters, QueryCache } from "@tanstack/react-query";
import { addDocoment } from "../firebase/firebaseModel.js";
import { useNavigation } from "expo-router";


const addMember = () => {
  const [inputvalue,onChangevalue] = useState('')
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const { control, handleSubmit } = useForm();

  const mutationAdd = useMutation<any, unknown, any>({
    mutationFn: (data) => addDocoment('STMinaKOUFData', data),

    onError: (error) => {
      console.error('Error updating document:', error);
    },
    // onSuccess: () => {
    //   // console.log("data is: ", data)
    //   const allMembersData = queryClient.getQueryData(['allMembers']);
    //   if(Array.isArray(allMembersData)){
    //     const updatedMembersData = [...allMembersData, newMember];
    //     queryClient.setQueryData(['allMembers'], updatedMembersData);
    //   }
    //   console.log("new data:",queryClient.getQueryData(['allMembers']))
    // }
  });

  const handleBackPress = () => {
    navigation.goBack();
  };



  async function onSubmit(data: any){
    mutationAdd.mutate(data);
    // setNewMember(data);
    await queryClient.refetchQueries();
    navigation.goBack();
  };



  // console.log('Cached allMembers data:', allMembersData);
  // console.log("imhere")

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

          <TouchableOpacity onPress={handleBackPress}>
            <Text>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            <Text>Add</Text>
          </TouchableOpacity>
          <TextInput
          onChangeText={onChangevalue}
          value={inputvalue}
          autoCapitalize="words"
          placeholder="First Name"

        />
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

          {/* <PhoneInputController
            name="PhoneNumber"
            control={control}
            rules={{
              required: "Phone number is required.",
            }}
          /> */}

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
              validate: (value:any) => checkEmail(value) || "Invalid email.",
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
                console.log("service data is: ", data);
                return true;
              },
            }}
            data={serviceOptions}
            placeholder="Choose Service"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default addMember;

const styles = StyleSheet.create({});