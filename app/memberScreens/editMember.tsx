import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useForm } from "react-hook-form";
import InputController from "../../components/InputController.jsx";
import { SafeAreaView } from "react-native-safe-area-context";
import PhoneInputController from "../../components/PhoneInputController.jsx";
import {
  serviceOptions,
  titleOptions,
  checkEmail,
  checkPersonalNumber,
} from "../../scripts/utilities.js";
import MultiSelectController from "../../components/MultiSelectController.jsx";
import OneSelectController from "../../components/OneSelectController.jsx";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  getOneDocInCollection,
  updateDocument,
} from "../../firebase/firebaseModel.js";
import { useNavigation } from "expo-router";
import AwesomeAlert from "react-native-awesome-alerts";
import { confirmPasswordReset } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const editMember = () => {
  const { memberId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [CofirmePasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    data: memberInfo,
    isLoading,
    isSuccess,
  } = useQuery({
    queryFn: () => getOneDocInCollection("STMinaKOUFData", memberId),
    queryKey: ["memberInfo", memberId],
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty, touchedFields },
  } = useForm({
    defaultValues: {
      Name: "",
      PersonalNumber: "",
      PhoneNumber: "",
      StreetName: "",
      PostNumber: "",
      city: "",
      Email: "",
      Password: "",
      ConfirmPassword: "",
      // Title: "",
      Service: "",
    },
  });

  const watchPassword = watch("Password", "");

  const navigation = useNavigation();

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  async function reftech(){
    await queryClient.refetchQueries({queryKey: ['memberInfo', memberId]})
  }

  const mutationUpdate = useMutation({
    mutationFn: (data) => {
      setIsUpdating(true);
      return updateDocument("STMinaKOUFData", memberId, data);
    },

    onError: (error) => {
      console.error("Error updating document:", error);
      setIsUpdating(false);
    },
    onSuccess: () => {
      reftech();
      setIsUpdating(false);
      navigation.goBack();
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
        Name: memberInfo.Name || "",
        PersonalNumber: memberInfo.PersonalNumber || "",
        PhoneNumber: memberInfo.PhoneNumber || "",
        StreetName: memberInfo.StreetName || "",
        PostNumber: memberInfo.PostNumber || "",
        city: memberInfo.city || "",
        Email: memberInfo.Email || "",
        Password: memberInfo.Password || "",
        ConfirmPassword: memberInfo.ConfirmPassword || "",

        // Title: memberInfo.Title || "",
        Service: memberInfo.Service || "",
      });
    }
  }, [isSuccess, memberInfo]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  async function onSubmit(data: any){
    console.log("button is pressed");
    mutationUpdate.mutate(data);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
          behavior="padding"
          enabled
        >
          <ScrollView

          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleBackPress}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back-outline" size={24} color="#000" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!isDirty}
                onPress={handleSubmit(onSubmit)}
                style={[
                  styles.saveButton,
                  !isDirty && styles.disabledSaveButton,
                ]}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>

            <InputController
              name="Name"
              control={control}
              rules={{
                required: "Name is required.",
                pattern: {
                  value: /^[a-zA-ZöäåÖÄÅ\s]+$/,
                  message: "This input is letters only.",
                },
                maxLength: {
                  value: 12,
                  message: "This input exceed maxLength.",
                },
              }}
              placeholder="För- och efternamn"
              autoCompleteType="name"
              keyboardType="default"
              secureTextEntry={false}
              autoCapitalize="words"
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
              secureTextEntry={false}
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
              autoCompleteType="street-address"
              keyboardType="default"
              secureTextEntry={false}
              autoCapitalize="words"
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
              autoCompleteType="postal-code"
              keyboardType="phone-pad"
              secureTextEntry={false}
            />

            <InputController
              name="PhoneNumber"
              control={control}
              rules={{
                required: "Phone number is required.",
              }}
              placeholder="Phone number"
              autoCompleteType="tel"
              keyboardType="phone-pad"
              secureTextEntry={false}
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
              secureTextEntry={false}
              autoCapitalize="words"
            />

            <InputController
              name="Email"
              control={control}
              rules={{
                required: "Email is required.",
                validate: (value: any) => checkEmail(value) || "Invalid email.",
              }}
              placeholder="Email"
              autoCompleteType="email"
              keyboardType="email-address"
              secureTextEntry={false}
            />

            <InputController
              name="Password"
              control={control}
              rules={{
                required: "Password is required.",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.",
                },
              }}
              placeholder="Password"
              secureTextEntry={true}
            />

            <InputController
              name="ConfirmPassword"
              control={control}
              rules={{
                required: "Confirm Password is required.",
                validate: (value: any) =>
                  value === watchPassword || "Passwords do not match.",
              }}
              placeholder="Confirm Password"
              secureTextEntry={true}
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
              placeholder="Which services are you intressted in?"
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
            {isUpdating && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#white" />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default editMember;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
    marginBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 18,
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  disabledSaveButton: {
    backgroundColor: "#d3d3d3",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
