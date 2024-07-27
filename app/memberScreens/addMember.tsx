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
import { addDocoment, AddMember } from "../../firebase/firebaseModel.js";
import { useNavigation } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { confirmPasswordReset } from "firebase/auth";

const addMember = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [image, setImage] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [CofirmePasswordVisible, setConfirmPasswordVisible] = useState(false);

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
      ProfilePicture: {},
      Email: "",
      Password: "",
    },
  });
  const watchPassword = watch("Password", "");

  async function refetch() {
    await queryClient.refetchQueries();
  }

  const mutationAdd = useMutation<any, unknown, any>({
    mutationFn: (data) => AddMember(data),

    onError: (error) => {
      console.error("Error updating document:", error);
    },
    onSuccess: () => {
      refetch();
      navigation.goBack();
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
    // try{
    mutationAdd.mutate(data);
    // } catch (error: any) {
    //   if (error.code === "auth/email-already-in-use") {
    //     setError("Email", {
    //       type: "manual",
    //       message: "This email is already in use.",
    //     });
    //   } else if (error.code === "auth/invalid-email") {
    //     setError("Email", {
    //       type: "manual",
    //       message: "That email address is invalid!",
    //     });
    //   } else {
    //     console.error("Error creating user:", error);
    //   }
    // }
  }

  //photo
  function deletePhoto() {
    setImage({});
    setValue("ProfilePicture", {});
    setError("ProfilePicture", {
      type: "manual",
      message: "Image is required",
    });
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
      setValue("ProfilePicture", selectedImage);
      clearErrors("ProfilePicture");
    }
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
          <ScrollView
          // contentContainerStyle={{ flexGrow: 1 }}
          // keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity onPress={handleBackPress}>
              <Text>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit(onSubmit)}>
              <Text>join</Text>
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
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={deletePhoto}
                    >
                      <Text style={styles.modalButtonText}>Delete Photo</Text>
                    </TouchableOpacity>
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
                  value: 12,
                  message: "This input exceed maxLength.",
                },
              }}
              placeholder="För- och efternamn"
              autoCompleteType="name"
              keyboardType="default"
              secureTextEntry={undefined}
              rightIcon={undefined}
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
              secureTextEntry={undefined}
              rightIcon={undefined}
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
              secureTextEntry={undefined}
              rightIcon={undefined}
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
              secureTextEntry={undefined}
              rightIcon={undefined}
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
              secureTextEntry={undefined}
              rightIcon={undefined}
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
              secureTextEntry={undefined}
              rightIcon={undefined}
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
              secureTextEntry={undefined}
              rightIcon={undefined}
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
                  console.log("service data is: ", data);
                  return true;
                },
              }}
              data={serviceOptions}
              placeholder="Which Services are you intressted in? "
            />


          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default addMember;

const styles = StyleSheet.create({
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
