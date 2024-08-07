import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import InputController from "@/components/InputController";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addEvent } from "@/firebase/firebaseModel";
import { Loading } from "@/components/loading";
import { RootStackParamList } from "@/constants/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import SelectDateControl from "@/components/selectDateControll";
import ImagePickerControl from "@/components/ImagePickerControl";
// import ImageCropPicker from 'react-native-image-crop-picker';
const CreateEvent = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shownDate, setShowenDate] = useState("");
  const [isPickerShowen, setIsPickerShowen] = useState(false);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [image, setImage] = useState<any>({});
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
    setValue,
    clearErrors,
    setError,
  } = useForm({
    defaultValues: {
      Date: "",
      ImageInfo: {},
    },
  });

  const mutationCreateEvent = useMutation<any, unknown, any>({
    mutationFn: (data) => addEvent(data),

    onError: (error) => {
      setIsUpdating(false);
      Alert.alert("Something went wrong, try again");
      console.error("Error adding document:", error);
    },
    onSuccess: () => {
      queryClient.refetchQueries();
      setIsUpdating(false);
      navigation.goBack();
    },
  });

  async function onSubmit(data: any) {
    console.log(data);
    setIsUpdating(true);
    mutationCreateEvent.mutate(data);
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
              style={styles.addButton}
              onPress={handleSubmit(onSubmit)}
            >
              <Text>Add</Text>
            </TouchableOpacity>
            <ImagePickerControl
              name="ImageInfo"
              control={control}
              rules={{
                required: "Image is required.",
              }}
            />
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
            />
            <SelectDateControl
              name="Date"
              control={control}
              rules={{
                required: "Date is required.",
              }}
            />
            {isUpdating && <Loading></Loading>}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateEvent;

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#decbc6",
  },
});
