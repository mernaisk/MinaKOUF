import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Platform,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOneDocInCollection,
  updateDocument,
} from "@/firebase/firebaseModel";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import InputController from "@/components/InputController";
import DateTimePicker from "@react-native-community/datetimepicker";
import AwesomeAlert from "react-native-awesome-alerts";
import { Loading } from "@/components/loading";
import { RootStackParamList } from "@/constants/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";

type EventsDetailsRouteProp = RouteProp<RootStackParamList, "EventInfo">;

const EditEvent = () => {
  //   const { eventId } = useLocalSearchParams();
  // const eventId = "dQXbEYYWa7Jy2nerdC93";
  const route = useRoute<EventsDetailsRouteProp>();
  const { eventId } = route.params; // Extract the sheetId parameter
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const queryClient = useQueryClient();
  const [image, setImage] = useState<any>({});
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shownDate, setShowenDate] = useState("");
  const [isPickerShowen, setIsPickerShowen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false)
  async function refetch(){
    await queryClient.refetchQueries();

  }
  const {
    data: eventInfo,
    isLoading,
    isSuccess,
  } = useQuery({
    queryFn: () => getOneDocInCollection("STMinaKOUFEvents", eventId),
    queryKey: ["eventInfo"],
  });
  const updateEventInfoMutation = useMutation({
    mutationFn: (data) => updateDocument("STMinaKOUFEvents", eventId, data),
    onError: (error) => {
      setIsUpdating(false)
      console.error("Error updating document:", error);
    },
    onSuccess: (data: any) => {
      // reset(data);
      refetch();
      setIsUpdating(false);
      navigation.goBack();


    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    getValues,
    setValue,
    clearErrors,
    setError,
  } = useForm({
    defaultValues: {
      Title: "",
      Place: "",
      Info: "",
      Price: "",
      Date: "",
      ImageInfo: {},
    },
  });

  // useEffect(() => {
  //   if (isSuccess && eventInfo) {
  //     reset({
  //       Title: eventInfo.Title || "",
  //       Place: eventInfo.Place || "",
  //       Info: eventInfo.Info || "",
  //       Price: eventInfo.Price || "",
  //       Date: eventInfo.Date || "",
  //       ImageInfo: eventInfo.ImageInfo || {},
  //     });
  //     console.log(eventInfo.imageInfo);
  //     setImage(eventInfo.imageInfo);
  //   }
  // }, [isSuccess, eventInfo]);

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
      //   console.log("selimage is: ", selectedImage);
      setImage(selectedImage);

      //   console.log("image is: ", image);
      setValue("ImageInfo", selectedImage);
      clearErrors("ImageInfo");
    }
  };

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
            editable={false} secureTextEntry={false}          />
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
          onPressIn={toggleIsPickerShown} secureTextEntry={false}        />
      );
    }
  };

  if (isLoading) {
    return (
      <Loading></Loading>
    );
  }

  const handleBackPress = () => {
    if (isDirty) {
      setIsAlertVisible(true);
    } else {
      navigation.goBack();
    }
  };

  const onSubmit = (data: any) => {
    // console.log("button is pressed");
    setIsUpdating(true)
    updateEventInfoMutation.mutate(data);
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={handleBackPress}>
        <Text>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity disabled={!isDirty} onPress={handleSubmit(onSubmit)}>
        <Text>save</Text>
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
        placeholder="Title" secureTextEntry={undefined}      />

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
        placeholder="Place name" secureTextEntry={undefined}      />

      <InputController
        name="Info"
        control={control}
        rules={{
          required: false,
        }}
        placeholder="Info" secureTextEntry={undefined}      />

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
        placeholder="Price" secureTextEntry={undefined}      />

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

      <Controller
        name="ImageInfo"
        control={control}
        render={() => (
          <View>
            {image?.uri && (
              <Image
                source={{ uri: image?.uri }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
            )}
          </View>
        )}
      />

      <TouchableOpacity onPress={pickImage}>
        <Text>change photo</Text>
      </TouchableOpacity>

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
    </SafeAreaView>
  );
};

export default EditEvent;

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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
