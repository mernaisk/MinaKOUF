import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocalSearchParams } from 'expo-router';
import { Button, YStack, Spinner } from 'tamagui';
import customController from '../components/customController.jsx';
import { getOneDocInCollection, updateDocument, deleteDocument, deleteIdFromAttendenceSheet } from "../firebase/firebaseModel.js";
import { serviceOptions, titleOptions, checkEmail, checkPersonalNumber } from '../scripts/utilities.js';
import multiSelect from '../components/multiSelect.jsx';
import oneSelect from '../components/oneSelect.jsx';
import tamaguiInput from '../components/tamaguiInput.jsx';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorMessage } from '@hookform/error-message';

const MemberInfo = () => {
  const { memberId } = useLocalSearchParams();

  const queryClient = useQueryClient();
  const [isEditTriggered, setEditTrigered] = useState(false);

  const { register, formState: { errors }, handleSubmit, control, setValue, watch } = useForm({
    criteriaMode: "all",
  });

  const allVar = watch();
  console.log(allVar);

  const { data: memberInfo, isLoading } = useQuery({
    queryFn: () => getOneDocInCollection("STMinaKOUFData", memberId),
    queryKey: ["memberInfo", memberId]
  });

  const mutationDelete = useMutation({
    mutationFn: (ID) => deleteDocument("STMinaKOUFData", ID),
    onSuccess: () => {
      queryClient.invalidateQueries("allMembers");
    },
    onError: (error) => {
      console.error("Error deleting document:", error);
    }
  });

  const mutationUpdate = useMutation({
    mutationFn: (data) => updateDocument("STMinaKOUFData", memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries("allMembers");
    },
    onError: (error) => {
      console.error("Error updating document:", error);
    }
  });

  const mutationDeleteIdFromAttendence = useMutation(ID => deleteIdFromAttendenceSheet(ID));

  function handleDeleteClick() {
    mutationDeleteIdFromAttendence.mutate(memberId);
    mutationDelete.mutate(memberId);
  }

  function onSubmit(data) {
    console.log(data);
    mutationUpdate.mutate(data);
  }

  useEffect(() => {
    if (memberInfo) {
      setValue("FirstName", memberInfo.FirstName);
      setValue("LastName", memberInfo.LastName);
      setValue("PhoneNumber", memberInfo.PhoneNumber);
      setValue("PersonalNumber", memberInfo.PersonalNumber);
      setValue("StreetName", memberInfo.StreetName);
      setValue("PostNumber", memberInfo.PostNumber);
      setValue("city", memberInfo.city);
      setValue("Email", memberInfo.Email);
      setValue("Title", memberInfo.Title);
      setValue("Service", memberInfo.Service);
    }
  }, [memberInfo, setValue]);

  if (isLoading) {
    return <YStack><Spinner size="large" color="$green10" /></YStack>;
  }

  function handleEditClick() {
    setEditTrigered(!isEditTriggered);
  }

  return (
    <SafeAreaView>
      <Button>Member Info: {memberId}</Button>
      {isEditTriggered ? (
        <Button onPress={handleEditClick}>Save</Button>
      ) : (
        <Button onPress={handleEditClick}>Edit</Button>
      )}

      {customController({
        control,
        errors,
        RegisterName: "FirstName",
        customRules: {
          required: "First name is required.",
          pattern: {
            value: /^[a-zA-Z]+$/,
            message: "This input is letters only."
          },
          maxLength: {
            value: 12,
            message: "This input exceed maxLength."
          }
        },
        renderField: tamaguiInput,
        renderFieldProps: { placeholder: "First Name", isDisabled: !isEditTriggered }
      })}
        <ErrorMessage errors={errors} name="FirstName">
          {({ messages }) => {
          console.log(messages);
          return (
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <Text key={type}>{message}</Text>
            ))
          );
        }}
      </ErrorMessage>

      {customController({
        control,
        errors,
        RegisterName: "LastName",
        customRules: {
          required: "Last name is required.",
          pattern: {
            value: /^[a-zA-Z]+$/,
            message: "This input is letters only."
          },
          maxLength: {
            value: 12,
            message: "This input exceed maxLength."
          }
        },
        renderField: tamaguiInput,
        renderFieldProps: { placeholder: "Last Name", isDisabled: !isEditTriggered }
      })}

      {customController({
        control,
        errors,
        RegisterName: "PersonalNumber",
        customRules: {
          required: "Personal number is required.",
          validate: (value) => {
            const result = checkPersonalNumber(value);
            return result.boolean ? true : result.message;
          }
        },
        renderField: tamaguiInput,
        renderFieldProps: { placeholder: "YYYYMMDD-XXXX", isDisabled: !isEditTriggered }
      })}

      {customController({
        control,
        errors,
        RegisterName: "StreetName",
        customRules: { required: "Street name is required." },
        renderField: tamaguiInput,
        renderFieldProps: { placeholder: "Street Name", isDisabled: !isEditTriggered }
      })}

      {customController({
        control,
        errors,
        RegisterName: "PostNumber",
        customRules: {
          required: "Post number is required.",
          pattern: {
            value: /\d{5}/,
            message: "Invalid post number. It should be 5 digits."
          }
        },
        renderField: tamaguiInput,
        renderFieldProps: { placeholder: "Post number", isDisabled: !isEditTriggered }
      })}

      {customController({
        control,
        errors,
        RegisterName: "city",
        customRules: { required: "City is required." },
        renderField: tamaguiInput,
        renderFieldProps: { placeholder: "City", isDisabled: !isEditTriggered }
      })}

      {customController({
        control,
        errors,
        RegisterName: "Email",
        customRules: {
          required: "Email is required.",
          validate: (value) => checkEmail(value) || "Invalid email."
        },
        renderField: tamaguiInput,
        renderFieldProps: { placeholder: "Email", isDisabled: !isEditTriggered }
      })}

      {customController({
        control,
        errors,
        RegisterName: "Title",
        customRules: { required: "Title is required." },
        renderField: oneSelect,
        renderFieldProps: { placeholder: "Select title", data: titleOptions, isDisabled: !isEditTriggered }
      })}

      {customController({
        control,
        errors,
        RegisterName: "Service",
        customRules: { required: "Service is required." },
        renderField: multiSelect,
        renderFieldProps: { placeholder: "Select Service", data: serviceOptions, isDisabled: !isEditTriggered }
      })}

      <Button type="submit" onPress={handleSubmit(onSubmit)}>Save</Button>
    </SafeAreaView>
  );
};

export default MemberInfo;


