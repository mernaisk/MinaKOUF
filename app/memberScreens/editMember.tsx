import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import InputController from "../../components/InputController.jsx";
import { SafeAreaView } from "react-native-safe-area-context";
// import * as ImagePicker from "expo-image-picker";
import { launchImageLibrary, MediaType } from "react-native-image-picker";

import {
  serviceOptions,
  checkEmail,
  checkPersonalNumber,
} from "../../scripts/utilities.js";
import MultiSelectController from "../../components/MultiSelectController.jsx";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  getOneDocInCollection,
  updateDocument,
  updateMemberInfo,
} from "../../firebase/firebaseModel.js";
import AwesomeAlert from "react-native-awesome-alerts";
import { Ionicons } from "@expo/vector-icons";
import { Loading } from "../../components/loading";
import { RootStackParamList } from "@/constants/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";

type MemberInfosRouteProp = RouteProp<RootStackParamList, "MemberInfo">;

const EditMember = () => {
  
  const route = useRoute<MemberInfosRouteProp>();
  const { memberId } = route.params; // Extract the sheetId parameter
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  // const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [image, setImage] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);

  interface MemberInfo {
    ProfilePicture: any;
    Name: string;
    PersonalNumber: string;
    PhoneNumber: string;
    StreetName: string;
    PostNumber: string;
    City: string;
    Email: string;
    Password: string;
    ConfirmPassword: string;
    Service: any; // Depending on how Service is structured
    Title:string;
  }

  const memberInfo = queryClient.getQueryData<MemberInfo>([
    "memberInfo",
    memberId,
  ]);

  const {
    control,
    handleSubmit,
    watch,
    clearErrors,
    reset,
    setValue,
    formState: { isDirty, touchedFields },
  } = useForm<MemberInfo>({
    defaultValues: {
      ProfilePicture: {},
      Name: "",
      PersonalNumber: "",
      PhoneNumber: "",
      StreetName: "",
      PostNumber: "",
      City: "",
      Email: "",
      Password: "",
      ConfirmPassword: "",
      Service: "",
    },
  });

  const watchPassword = watch("Password", "");


  const [isAlertVisible, setIsAlertVisible] = useState(false);

  async function reftech() {
    await queryClient.refetchQueries({queryKey: ['memberInfo', memberId]})
    await queryClient.refetchQueries({queryKey: ['allMembers']})

//Later, change everything to setQueryData
//what is the different between invalidatequery and refetchQueries in terms of how quick the data is displayed
  }

  const mutationUpdate = useMutation({
    mutationFn: (data: MemberInfo) => {
      setIsUpdating(true);
      return updateMemberInfo( memberId, data, memberInfo?.ProfilePicture);
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
        ProfilePicture: memberInfo.ProfilePicture || "",
        Name: memberInfo.Name || "",
        PersonalNumber: memberInfo.PersonalNumber || "",
        PhoneNumber: memberInfo.PhoneNumber || "",
        StreetName: memberInfo.StreetName || "",
        PostNumber: memberInfo.PostNumber || "",
        City: memberInfo.City || "",
        Email: memberInfo.Email || "",
        Password: memberInfo.Password || "",
        ConfirmPassword: memberInfo.ConfirmPassword || "",
        Service: memberInfo.Service || "",
      });
      setImage(memberInfo?.ProfilePicture)
    }
  }, [memberInfo, reset]);

  useEffect(() => {
    const watchedValue = watch()
    // console.log("watchedValue is: ", watchedValue.ProfilePicture)
    // console.log("isDirty is: ", isDirty)
  })
  

  // if (isLoading) {
  //   return <Loading></Loading>;
  // }

  async function onSubmit(data: any) {
    // console.log("button is pressed");
    mutationUpdate.mutate(data);
  }

  function deletePhoto() {
    setImage({});
    setValue("ProfilePicture", {}, { shouldDirty: true });
    // setError("ProfilePicture", {
    //   type: "manual",
    //   message: "Image is required",
    // });
    setModalVisible(false);
  }

  // const pickImage = async () => {
  //   if (status === null || status.status !== "granted") {
  //     const { status } = await requestPermission();
  //     if (status !== "granted") {
  //       return;
  //     }
  //   }

  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     console.log("result is ",result);
  //     const selectedImage = result.assets[0];

  //     setImage({assetInfo: selectedImage, URL: ""});


  //     setValue("ProfilePicture", {assetInfo: selectedImage, URL: ""}, { shouldDirty: true });
  //   }
  //   setModalVisible(false);
  // };

  const pickImage = async () => {
    const options: {
      mediaType: MediaType;
      includeBase64: boolean;
    } = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
    };
  
    launchImageLibrary(options, (response:any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const selectedImage = response.assets[0];
        setImage({ assetInfo: selectedImage, URL: "" });
        setValue("ProfilePicture", { assetInfo: selectedImage, URL: "" }, { shouldDirty: true });
      }
    });
    setModalVisible(false);
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
          behavior="padding"
          enabled
        >
          <ScrollView>
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

            <Controller
              name="ProfilePicture"
              control={control}
              render={() => (
                <View style={styles.profilePictureContainer}>
                  <View style={styles.profilePicture}>
                    {image?.assetInfo?.uri ? (
                      <Image
                        source={{ uri: image?.assetInfo.uri }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons
                        name="person-circle-outline"
                        size={100}
                        color="#ccc"
                      />
                    )}
                    <TouchableOpacity
                      style={styles.editIcon}
                      onPress={() => setModalVisible(true)}
                    >
                      <Ionicons name="pencil-outline" size={24} color="#000" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    {image?.uri && (
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={deletePhoto}
                      >
                        <Text style={styles.modalButtonText}>Delete Photo</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={pickImage}
                    >
                      <Text style={styles.modalButtonText}>Change Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
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
              name="Service"
              control={control}
              rules={{
                required: "Service is required.",
                // validate: (data: any) => {
                //   console.log(data);
                //   return true;
                // },
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
            {isUpdating && <Loading></Loading>}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    backgroundColor: "#fff",
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
});
