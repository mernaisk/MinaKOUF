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
import { Controller, useForm } from "react-hook-form";
import InputController from "../../components/InputController.jsx";
import {
  serviceOptions,
  titleOptions,
  checkEmail,
  checkPersonalNumber,
} from "../../scripts/utilities.js";
import MultiSelectController from "../../components/MultiSelectController.jsx";
import OneSelectController from "../../components/OneSelectController.jsx";
import {
  useMutation,
  useQueryClient,
  InvalidateQueryFilters,
  QueryCache,
} from "@tanstack/react-query";
import { AddMemberFirebase } from "../../firebase/firebaseModel.js";
import * as ImagePicker from "expo-image-picker";
import ScreenWrapper from "../ScreenWrapper.js";
import { Loading } from "@/components/loading";
import { validatePhoneNumber } from "../../scripts/utilities.js";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/types.js";

const AddMember = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [image, setImage] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      ProfilePicture: {
        assetInfo: {},
        URL: "",
      },
      Email: "",
      Password: "",
    },
  });
  const watchPassword = watch("Password", "");

  async function refetch() {
    await queryClient.refetchQueries();
  }

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
    mutationAdd.mutate(data);
  }

  //photo
  function deletePhoto() {
    setImage({});
    setValue("ProfilePicture", { assetInfo: {}, URL: "" });
    // setError("ProfilePicture", {
    //   type: "manual",
    //   message: "Image is required",
    // });
    setModalVisible(false);
  }

  const pickImage = async () => {
    if (status === null || status.status !== "granted") {
      const { status } = await requestPermission();
      if (status !== "granted") {
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 6],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      const selectedImage = result.assets[0];
      console.log("selimage is: ", selectedImage);
      setImage(selectedImage);

      console.log("image is: ", image);
      setValue("ProfilePicture", { assetInfo: selectedImage, URL: "" });
      clearErrors("ProfilePicture");
    }
    setModalVisible(false);
  };

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

            <Controller
              name="ProfilePicture"
              control={control}
              render={({ field }) => (
                <View style={styles.profilePictureContainer}>
                  <View style={styles.profilePicture}>
                    {image?.uri ? (
                      <Image
                        source={{ uri: image?.uri }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons
                        name="person-circle-outline"
                        size={100}
                        color="#726d81"
                      />
                    )}
                    <TouchableOpacity
                      style={styles.editIcon}
                      onPress={() => setModalVisible(true)}
                    >
                      <Ionicons name="pencil-outline" size={24} color="white" />
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

            {errors.ProfilePicture && (
              <Text style={{ color: "red" }}>
                {errors?.ProfilePicture.message}
              </Text>
            )}

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

            <View style={styles.multiselect}>
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
                placeholder="Which Services are you intressted in? "
              />
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.addButtonText}>Join</Text>
            </TouchableOpacity>

            {isLoading && <Loading></Loading>}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddMember;

const styles = StyleSheet.create({
  multiselect: {
    marginBottom: 100,
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
