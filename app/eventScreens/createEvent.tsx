import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "expo-router";
import InputController from "@/components/InputController";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addEvent } from "@/firebase/firebaseModel";
import { Loading } from "@/components/loading";

const createEvent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shownDate, setShowenDate] = useState("");
  const [isPickerShowen, setIsPickerShowen] = useState(false);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [image, setImage] = useState<any>({});
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [isUpdating,setIsUpdating] = useState(false);
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
      setIsUpdating(false)
      Alert.alert("Something went wrong, try again")
      console.error("Error adding document:", error);
    },
    onSuccess: () => {
      queryClient.refetchQueries();
      setIsUpdating(false)
      navigation.goBack();
    },
  });

  async function onSubmit(data: any) {
    console.log(data);
    setIsUpdating(true)
    mutationCreateEvent.mutate(data);
  }

  //select date
  const onChange = ({ type }: any, selectedDate: any) => {
    if (type == "set") {
      setSelectedDate(selectedDate);
      if (Platform.OS === "android") {
        toggleIsPickerShown();
        setShowenDate(selectedDate.toDateString());
      }
    } else {
      toggleIsPickerShown();
    }
  };

  function toggleIsPickerShown() {
    setIsPickerShowen(!isPickerShowen);
  }

  useEffect(() => {
    if (shownDate) {
      setValue("Date", shownDate);
      clearErrors("Date");
    }
  }, [shownDate]);

  const renderDateInput = () => {
    const datePlaceholder = shownDate ? shownDate : "Select Date";
    if (Platform.OS === "android") {
      return (
        <Pressable onPress={toggleIsPickerShown}>
          <InputController
            name="Date"
            control={control}
            rules={{
              required: "Date is required.",
            }}
            placeholder={datePlaceholder}
            editable={false}
            secureTextEntry={undefined}
          />
        </Pressable>
      );
    }

    if (Platform.OS === "ios") {
      return (
        <InputController
          name="Date"
          control={control}
          rules={{
            required: "Date is required.",
          }}
          placeholder={datePlaceholder}
          editable={false}
          onPressIn={toggleIsPickerShown}
          secureTextEntry={undefined}
        />
      );
    }
  };

  //photo
  function deletePhoto() {
    setImage({});
    setValue("ImageInfo", {});
    setError("ImageInfo", {
      type: "manual",
      message: "Image is required",
    });
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
      setValue("ImageInfo", selectedImage);
      clearErrors("ImageInfo");
    }
  };

  return (
    <SafeAreaView>
      <Text>createEvent</Text>
      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <Text>Add</Text>
      </TouchableOpacity>

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

      {/* date */}
      {renderDateInput()}

      {isPickerShowen && (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={selectedDate}
          onChange={onChange}
          minimumDate={new Date()}
        />
      )}

      {isPickerShowen && Platform.OS === "ios" && (
        <View style={styles.buttonsView}>
          <TouchableOpacity
            style={styles.pickerButtons}
            onPress={toggleIsPickerShown}
          >
            <Text style={styles.buttonText}>cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pickerButtons}
            onPress={() => {
              toggleIsPickerShown();
              setShowenDate(selectedDate.toDateString());
            }}
          >
            <Text style={styles.buttonText}>confirm</Text>
          </TouchableOpacity>
        </View>
      )}

      {/*image */}
      <Controller
        name="ImageInfo"
        control={control}
        // rules={{
        //   validate: (data: any) => {
        //     if (!image.uri) {
        //       return "Image is required";
        //     }
        //     return true;
        //   },
        // }}
        render={({ field }) => (
          <View>
            {image?.uri && (
              <Image
                source={{ uri: image?.uri }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
            )}
            {image?.uri && (
              <TouchableOpacity onPress={deletePhoto}>
                <Text>delete photo</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <TouchableOpacity onPress={pickImage}>
        <Text>choose photo</Text>
      </TouchableOpacity>

      {errors.ImageInfo && (
        <Text style={{ color: "red" }}>{errors.ImageInfo.message}</Text>
      )}
      {isUpdating && (<Loading></Loading>)}
    </SafeAreaView>
  );
};

export default createEvent;

const styles = StyleSheet.create({
  buttonsView: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  pickerButtons: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#11182711",
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#075985",
  },
  imagePreview: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
