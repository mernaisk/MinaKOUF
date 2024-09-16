import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm, FormProvider } from "react-hook-form";

import InputController from "../../components/InputController.jsx";
import {
  serviceOptions,
  titleOptions,
  checkEmail,
  checkPersonalNumber,
} from "../../scripts/utilities.js";
import MultiSelectController from "../../components/MultiSelectController";

import {
  useMutation,
  useQueryClient,
  InvalidateQueryFilters,
  QueryCache,
  useQuery,
} from "@tanstack/react-query";
import {
  
  getAllDocInCollection,
} from "../../firebase/firebaseModel";
import * as ImagePicker from "expo-image-picker";
import ScreenWrapper from "../ScreenWrapper.js";
import { Loading } from "@/components/loading";
import { validatePhoneNumber } from "../../scripts/utilities.js";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ChurchInfo, RootStackParamList } from "@/constants/types.js";
import { useUser } from "@/context/userContext.js";
import ImagePickerControl from "@/components/ImagePickerControl";
import { AddMemberFirebase } from "@/firebase/firebaseModelMembers";
import OneSelectController from "@/components/OneSelectController";
const AddMember = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const [isUpdating, setIsLoading] = useState(false);
  const { setIsMemberBeingCreated } = useUser();

  const testItems =[
    {Name: "Test1",Id:"Test1",Disabled:true},
    {Name: "Test2",Id:"Test2",Disabled:false},
    {Name: "Test3",Id:"Test3",Disabled:true}
  ]
  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ProfilePicture: { assetInfo: {}, URL: "" },
      Email: "",
      Password: "",
      Service:[],
      Orginization:[]
    },
  });
  // getAllDocInCollection("Churchs")
  const watchPassword = watch("Password", "");
  console.log("watched values are: ",watch());
  async function refetch() {
    await queryClient.refetchQueries();
  }

  const { data: churchNames, isLoading } = useQuery({
    queryFn: () => getAllDocInCollection("Churchs"),
    queryKey: ["churchs"],
    // select: (data) =>
    // data.map((item: any) => ({ label: item.name, value: item.Id })), // Assuming item has name and id fields
  });

  const OrgnizationsWithoutRiksKOUF = churchNames?.filter((church:ChurchInfo) => {return church?.Name !== "RiksKOUF" })
  let OrgOptions: any[] = [];

  function createOptions(item:any){
    OrgOptions = [...OrgOptions,{Name:item.Name, Id:item.Name, Disabled:false}]
    console.log(OrgOptions)
  }

  OrgnizationsWithoutRiksKOUF?.map(createOptions)
  console.log(churchNames);
  const mutationAdd = useMutation<any, unknown, any>({
    mutationFn: (data) => {
      setIsLoading(true); // Start loading
      return AddMemberFirebase(data);
    },

    onError: (error: any) => {
      setIsLoading(false); // Stop loading

      if (error.code === "auth/email-already-in-use") {
        setError("Email", {
          type: "manual",
          message: "This email is already in use.",
        });
      } else if (error.code === "auth/invalid-email") {
        setError("Email", {
          type: "manual",
          message: "That email address is invalid!",
        });
      } else {
        Alert.alert("Technical wrong, try again");
        navigation.goBack();
      }
      throw error;
    },
    onSuccess: () => {
      refetch();
      setIsLoading(false); // Stop loading
      setIsMemberBeingCreated(false);

      // router.push({ pathname: "/home" });
      // console.log("data is: ", data)
      // const allMembersData = queryClient.getQueryData(['allMembers']);
      // if(Array.isArray(allMembersData)){
      //   const updatedMembersData = [...allMembersData, newMember];
      //   queryClient.setQueryData(['allMembers'], updatedMembersData);
      // }
      // console.log("new data:",queryClient.getQueryData(['allMembers']))
    },
  });

  const handleBackPress = () => {
    navigation.goBack();
  };

  async function onSubmit(data: any) {
    setIsMemberBeingCreated(true);
    mutationAdd.mutate(data);
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
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back-outline" size={24} color="#000" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

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
            />

            <InputController
              name="PhoneNumber"
              control={control}
              rules={{
                required: "Phone number is required.",
                validate: validatePhoneNumber,
              }}
              placeholder="Phone number"
              autoCompleteType="tel"
              keyboardType="phone-pad"
              secureTextEntry={false}
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
            />

            <InputController
              name="Email"
              control={control}
              rules={{
                required: "Email is required.",
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
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
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
              control={control}
              name="Service"
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
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.addButtonText}>Join</Text>
            </TouchableOpacity>

            {isUpdating && <Loading></Loading>}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddMember;

const styles = StyleSheet.create({
  multiselect: {
    // marginBottom: 100,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
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
    borderColor: "#726d81",
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
    backgroundColor: "#726d81",
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 18,
    color: "#000",
  },
  addButton: {
    backgroundColor: "#4a4e69", // Change this to your desired background color
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "70%",
    height: 50,
    borderRadius: 10,
    marginBottom: 50, // Add margin to ensure spacing from other elements
    alignSelf: "center", // Center the button horizontally
  },
  addButtonText: {
    color: "white", // Change this to your desired text color
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#decbc6",
  },
});
