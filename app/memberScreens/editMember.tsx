import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import InputController from "../../components/InputController.jsx";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  serviceOptions,
  checkEmail,
  checkPersonalNumber,
} from "../../scripts/utilities.js";
import MultiSelectController from "../../components/MultiSelectController";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getAllDocInCollection } from "../../firebase/firebaseModel";
import AwesomeAlert from "react-native-awesome-alerts";
import { Ionicons } from "@expo/vector-icons";
import { Loading } from "../../components/loading";
import { ChurchInfo, RootStackParamList } from "@/constants/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";
import ImagePickerControl from "@/components/ImagePickerControl";
import { MemberInfo } from "@/constants/types";
import OneSelectController from "@/components/OneSelectController";
import { useUser } from "@/context/userContext.js";
import { updateMemberInfo } from "@/firebase/firebaseModelMembers";
type MemberInfosRouteProp = RouteProp<RootStackParamList, "MemberInfo">;

const EditMember = () => {
  const route = useRoute<MemberInfosRouteProp>();
  const { memberId } = route.params; // Extract the sheetId parameter
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const memberInfo = queryClient.getQueryData<MemberInfo>([
    "memberInfo",
    memberId,
  ]);

  const { user, userInfo } = useUser();

  function checkAccess() {
    if (userInfo?.IsActiveInKOUF === "Yes" || userInfo?.IsActiveInRiksKOUF === "Yes") {
      if (user?.uid !== memberId) {
        return true;
      }
      return false;
    }
    return false;
  }

  const {
    control,
    handleSubmit,
    watch,
    clearErrors,
    reset,
    setValue,
    formState: { isDirty, touchedFields },
  } = useForm<any>({
    defaultValues: {
      ProfilePicture: { URL: "", assetInfo: {} },
      Name: "",
      PersonalNumber: "",
      PhoneNumber: "",
      StreetName: "",
      PostNumber: "",
      City: "",
      Email: "",
      Password: "",
      ConfirmPassword: "",
      Service: [],
      Orginization: "",
      Involvments: [],
      IsActiveInRiksKOUF: "",
      TitleRiksKOUF: "",
      IsActiveInKOUF: "",
      TitleKOUF: "",
      OrginizationNameKOUF: "",
    },
  });

  const watchCategory = watch("Category");
  const watchRiksKOUF = watch("IsActiveInRiksKOUF");
  const watchKOUF = watch("IsActiveInKOUF");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const watchedValues = watch();
  console.log("wateedvalues is : ", watchedValues);
  async function reftech() {
    await queryClient.refetchQueries({ queryKey: ["memberInfo", memberId] });
    await queryClient.refetchQueries({ queryKey: ["allMembers"] });
  }
  const { data: churchNames, isLoading } = useQuery({
    queryFn: () => getAllDocInCollection("Churchs"),
    queryKey: ["churchs"],
  });
  console.log("churchNaames is ", churchNames);
  const OrgnizationsWithoutRiksKOUF = churchNames?.filter(
    (church: ChurchInfo) => {
      return church?.Name !== "RiksKOUF";
    }
  );
  let OrgOptions: any[] = [];

  function createOptions(item: any) {
    OrgOptions = [
      ...OrgOptions,
      { Name: item.Name, Id: item.Name, Disabled: false },
    ];
    console.log(OrgOptions);
  }

  OrgnizationsWithoutRiksKOUF?.map(createOptions);

  const mutationUpdate = useMutation({
    mutationFn: (data: MemberInfo) => {
      setIsUpdating(true);
      if(!memberInfo){
        throw new Error("Error in updating memeber info");
        
      }
      return updateMemberInfo(memberId, data, memberInfo );
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
    if (memberInfo) {
      reset({
        ProfilePicture: memberInfo.ProfilePicture || { URL: "", assetInfo: {} },
        Name: memberInfo.Name,
        PersonalNumber: memberInfo.PersonalNumber,
        PhoneNumber: memberInfo.PhoneNumber,
        StreetName: memberInfo.StreetName,
        PostNumber: memberInfo.PostNumber,
        City: memberInfo.City,
        Email: memberInfo.Email,
        Password: memberInfo.Password,
        ConfirmPassword: memberInfo.ConfirmPassword,
        Service: memberInfo.Service,
        Involvments: memberInfo.Involvments,
        Orginization: memberInfo.Orginization,
        IsActiveInRiksKOUF: memberInfo.IsActiveInRiksKOUF,
        TitleRiksKOUF: memberInfo.TitleRiksKOUF,
        IsActiveInKOUF: memberInfo.IsActiveInKOUF,
        TitleKOUF: memberInfo.TitleKOUF,
        OrginizationNameKOUF: memberInfo.OrginizationNameKOUF,
      });
    }
  }, [memberInfo, reset]);

  async function onSubmit(data: any) {
    mutationUpdate.mutate(data);
  }

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={{ flex: 1 }}
            automaticallyAdjustKeyboardInsets={true}
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
            <ImagePickerControl
              name="ProfilePicture"
              control={control}
              isRequired={false}
              fallBackIcon={
                <Ionicons
                  name="person-circle-outline"
                  size={100}
                  color="#726d81"
                />
              }
              imagePreview={styles.profilePicture}
              imageStyling={styles.image}
              iconStyle={styles.editIcon}
              customSize={20}
            />
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
                  value: 20,
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
              name="City"
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

            <MultiSelectController
              name="Service"
              control={control}
              rules={{ required: "Please select at least one service." }}
              items={serviceOptions}
              title="Which services are you interested in"
              disabled={false}
            />
            <OneSelectController
              control={control}
              name="Orginization"
              rules={{ required: "Please select at least one church." }}
              items={OrgOptions}
              title="Which church/churchs do you belong to?"
              disabled={false}
            />

            <OneSelectController
              name="IsActiveInRiksKOUF"
              control={control}
              rules={{
                validate: (value: any) => {
                  // console.log(Object.keys(value).length)
                  if (value) {
                    if (Object.keys(value).length === 0) {
                      return "Please select if the member belongs to RiksKOUF.";
                    }
                  } else {
                    return "Please select if the member belongs to RiksKOUF.";
                  }
                  return true;
                },
              }}
              items={[
                { Name: "Yes", Id: "Yes", Disabled: false },
                { Name: "No", Id: "No", Disabled: false },
              ]}
              title={`Is ${
                memberInfo?.Name || "the member"
              } belongs to RiksKOUF?`}
              disabled={!checkAccess()}
            />

            {watchRiksKOUF === "Yes" && (
              <InputController
                name="TitleRiksKOUF"
                control={control}
                rules={{
                  required:
                    "Please enter the title if the member belongs to RiksKOUF.",
                }}
                placeholder="RiksKOUF Title"
                secureTextEntry={false}
                editable={checkAccess()}
              />
            )}

            <OneSelectController
              name="IsActiveInKOUF"
              control={control}
              rules={{
                validate: (value: any) => {
                  if (value) {
                    if (Object.keys(value).length === 0) {
                      return "Please answer if the member belongs to KOUF.";
                    }
                  } else {
                    return "Please answer if the member belongs to KOUF.";
                  }
                  return true;
                },
              }}
              items={[
                { Name: "Yes", Id: "Yes", Disabled: false },
                { Name: "No", Id: "No", Disabled: false },
              ]}
              title={`Is ${
                memberInfo?.Name || "the member"
              } belongs to any KOUF?`}
              disabled={!checkAccess()}
            />

            {watchKOUF === "Yes" && (
              <InputController
                name="TitleKOUF"
                control={control}
                rules={{
                  required:
                    "Please enter the title if the member belongs to KOUF.",
                }}
                placeholder="KOUF Title"
                secureTextEntry={false}
                editable={checkAccess()}
              />
            )}
            {watchKOUF === "Yes" && (
              <OneSelectController
                control={control}
                name="OrginizationNameKOUF"
                rules={{ required: "Please select at least one church." }}
                items={OrgOptions}
                title="Which church are you KOUF in?"
                disabled={!checkAccess()}
              />
            )}

            <MultiSelectController
              name="Involvments"
              control={control}
              rules={undefined}
              items={serviceOptions}
              title="Which services are you belonging to"
              disabled={!checkAccess()}
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
            {isUpdating && <Loading></Loading>}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditMember;

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
  profilePictureContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    position: "relative",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  editIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#d3d3d3",
    borderRadius: 15,
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalButton: {
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#decbc6",
  },
});
