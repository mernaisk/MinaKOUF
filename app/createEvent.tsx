import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "expo-router";
import InputController from "@/components/InputController";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addEvent } from "@/firebase/firebaseModel";

const createEvent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shownDate, setShowenDate] = useState("");
  const [isPickerShowen, setIsPickerShowen] = useState(false);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [image, setImage] = useState<any>({});
  const navigation = useNavigation();
  const queryClient = useQueryClient();

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
      date: "",
      imageInfo: {},
    },
  });

  const mutationCreateEvent = useMutation<any, unknown, any>({
    mutationFn: (data) => addEvent(data),

    onError: (error) => {
      console.error('Error adding document:', error);
    },
    onSuccess: () => {
      queryClient.refetchQueries();
      navigation.goBack();
    }
  });

  async function onSubmit(data: any) {
    console.log(data);
    mutationCreateEvent.mutate(data)
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
      setValue("date", shownDate);
      clearErrors("date");
    }
  }, [shownDate]);

  const renderDateInput = () => {
    const datePlaceholder = shownDate ? shownDate : "Select Date";
    if (Platform.OS === "android") {
      return (
        <Pressable onPress={toggleIsPickerShown}>
          <InputController
            name="date"
            control={control}
            rules={{
              required: "Date is required.",
            }}
            placeholder={datePlaceholder}
            editable={false}
          />
        </Pressable>
      );
    }

    if (Platform.OS === "ios") {
      return (
        <InputController
          name="date"
          control={control}
          rules={{
            required: "Date is required.",
          }}
          placeholder={datePlaceholder}
          editable={false}
          onPressIn={toggleIsPickerShown}
        />
      );
    }
  };


  //photo
  function deletePhoto() {
    setImage({});
    setValue("imageInfo", {});
    setError("imageInfo", {
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
      setValue("imageInfo", selectedImage);
      clearErrors("imageInfo");
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
      />

      <InputController
        name="Place name"
        control={control}
        rules={{
          required: "Place name is required.",
          pattern: {
            value: /^[a-zA-ZöäåÖÄÅ\s]+$/,
            message: "This input is letters only.",
          },
        }}
        placeholder="Place name"
      />

      <InputController
        name="Info"
        control={control}
        rules={{
          required: false,
        }}
        placeholder="Info"
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
        name="imageInfo"
        control={control}
        rules={{
          validate: (data: any) => {
            if (!image.uri) {
              return "Image is required";
            }
            return true;
          },
        }}
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

      {errors.imageInfo && (
        <Text style={{ color: "red" }}>{errors.imageInfo.message}</Text>
      )}
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
