import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import {useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDocument } from "@/firebase/firebaseModel";
import { SafeAreaView } from "react-native-safe-area-context";
import InputController from "@/components/InputController";
import AwesomeAlert from "react-native-awesome-alerts";
import { Loading } from "@/components/loading";
import { EventInfo, RootStackParamList } from "@/constants/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";
import BackButton from "@/components/BackButton";
import SelectDateControl from "@/components/selectDateControll";
import dayjs from "dayjs";
import ImagePickerControl from "@/components/ImagePickerControl";
import { updateEvent } from "@/firebase/firebaseModelEvents";

type EventsDetailsRouteProp = RouteProp<RootStackParamList, "EventInfo">;

const EditEvent = () => {
  //   const { eventId } = useLocalSearchParams();
  // const eventId = "dQXbEYYWa7Jy2nerdC93";
  const route = useRoute<EventsDetailsRouteProp>();
  const { eventId } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const queryClient = useQueryClient();

  const eventInfo = queryClient.getQueryData<EventInfo>(["EventInfo", eventId]);

  const [isUpdating, setIsUpdating] = useState(false);
  async function refetch() {
    await queryClient.refetchQueries({ queryKey: ["EventInfo", eventId] });
    await queryClient.refetchQueries({ queryKey: ["allEvents"] });
  }

  const updateEventInfoMutation = useMutation({
    mutationFn: async (data: EventInfo) => {
      if(!eventInfo){
        throw new Error("Event info doesnt exist");
        
      }
      setIsUpdating(true);
      await updateEvent(eventId, eventInfo, data);
    },
    onError: (error) => {
      setIsUpdating(false);
      console.error("Error updating document:", error);
    },
    onSuccess: () => {
      refetch();
      setIsUpdating(false);
      navigation.goBack();
    },
    
  });

  const {
    control,
    handleSubmit,
    watch,
    clearErrors,
    reset,
    setValue,
    formState: { isDirty, touchedFields },
  } = useForm<EventInfo>({
    defaultValues: {
      ImageInfo: { URL: "", assetInfo: {} },
      Title: "",
      Info: "",
      Place: "",
      PriceForNonMembers: "",
      PriceForMembers: "",
      MaxAmountOfBookings: "",
      SwishNumber: "",
      StartDate: {},
      EndDate: {},
      Deadline: {},
      EventInChurch: "",
      Bookings: eventInfo?.Bookings,
    },
  });

  function handleBackPress() {
    if (isDirty) {
      setIsAlertVisible(true);
    } else {
      navigation.goBack();
    }
  }

  const onSubmit = (data: any) => {
    setIsUpdating(true);
    updateEventInfoMutation.mutate(data);
  };

  useEffect(() => {
    if (eventInfo) {
      reset({
        ImageInfo: eventInfo.ImageInfo || { URL: "", assetInfo: {} },
        Title: eventInfo.Title || "",
        Info: eventInfo.Info || "",
        Place: eventInfo.Place || "",
        PriceForNonMembers: eventInfo.PriceForNonMembers || "",
        PriceForMembers: eventInfo.PriceForMembers || "",
        MaxAmountOfBookings: eventInfo.MaxAmountOfBookings || "",
        SwishNumber: eventInfo.SwishNumber || "",
        StartDate: eventInfo.StartDate || {},
        EndDate: eventInfo.EndDate || {},
        Deadline: eventInfo.Deadline || {},
        EventInChurch: eventInfo.EventInChurch || "",
      });
    }
  }, [eventInfo, reset]);
  const watchedstartdate: any = watch("StartDate");

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
              <BackButton handleBackPress={handleBackPress}></BackButton>
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
              name="ImageInfo"
              control={control}
              isRequired={true}
              fallBackIcon={<Text style={styles.fallBackIcon}>No Photo</Text>}
              imagePreview={styles.imagePreview}
              imageStyling={styles.Picture}
              iconStyle={styles.editIcon}
              customSize={30}
              // defaultValue={{ URL: "", assetInfo: {} }}
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
              name="PriceForNonMembers"
              control={control}
              rules={{
                required: "Standard price is required.",
                pattern: {
                  value: /\d/,
                  message: "Digits only",
                },
              }}
              placeholder="Standard price"
              secureTextEntry={false}
              keyboardType="phone-pad"
            />

            <InputController
              name="PriceForMembers"
              control={control}
              rules={{
                required: "Price for members is required.",
                pattern: {
                  value: /\d/,
                  message: "Digits only",
                },
              }}
              placeholder="Price for members"
              secureTextEntry={false}
              keyboardType="phone-pad"
            />

            <InputController
              name="MaxAmountOfBookings"
              control={control}
              rules={{
                required: "number is required.",
                pattern: {
                  value: /\d/,
                  message: "Digits only",
                },
              }}
              placeholder="Max antal personer"
              secureTextEntry={false}
              keyboardType="phone-pad"
            />

            <SelectDateControl
              name="StartDate"
              control={control}
              rules={{
                required: " Start Date and time is required.",
              }}
              placeholderDate={"Start Date"}
              placeholderTime={"Start Time"}
              minDate={dayjs().toDate()}
            />

            <SelectDateControl
              name="EndDate"
              control={control}
              rules={{
                required: "End Date and time is required.",
                validate: (endDate: any) => {
                  if (!watchedstartdate || !endDate) {
                    return "Both start and end dates are required.";
                  }

                  const startDayjs = dayjs(
                    watchedstartdate.dateTime,
                    "YYYY-MM-DD HH:mm"
                  );
                  const endDayjs = dayjs(endDate.dateTime, "YYYY-MM-DD HH:mm");

                  if (!endDayjs.isAfter(startDayjs)) {
                    return "End date must be later than start date.";
                  }

                  return true; // Return true if validation passes
                },
              }}
              placeholderDate={"End Date"}
              placeholderTime={"End Time"}
              minDate={dayjs().toDate()}
            />

            <SelectDateControl
              name="Deadline"
              control={control}
              rules={{
                required: " End Date and time is required.",
                validate: (deadlineDate: any) => {
                  if (!watchedstartdate || !deadlineDate) {
                    return "Both start and end dates are required.";
                  }
                  const startDayjs = dayjs(
                    watchedstartdate.dateTime,
                    "YYYY-MM-DD HH:mm"
                  );
                  const deadlineDayjs = dayjs(
                    deadlineDate.dateTime,
                    "YYYY-MM-DD HH:mm"
                  );

                  if (deadlineDayjs.isAfter(startDayjs)) {
                    return "Deadline must be earlier than start date.";
                  }

                  return true;
                },
              }}
              placeholderDate={"Deadline Date"}
              placeholderTime={"Deadline Time"}
              minDate={dayjs().toDate()}
            />

            <InputController
              name="EventInChurch"
              control={control}
              rules={{}}
              placeholder="Event In Church"
              secureTextEntry={false}
              editable={false}
            />

            <InputController
              name="SwishNumber"
              control={control}
              rules={{}}
              placeholder="Swish number"
              secureTextEntry={false}
              editable={false}
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

  editIcon: {
    position: "absolute",
    bottom: -15,
    right: -15,
    backgroundColor: "#decbc6",
    borderColor: "#726d81",
    borderWidth: 2,
    borderRadius: 15,
    padding: 5,
  },
  fallBackIcon: {
    fontSize: 30,
    fontWeight: "500",
  },

  Picture: {
    width: 300,
    height: 300,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#726d81",
    position: "relative",
  },
  container: {
    flex: 1,
    backgroundColor: "#decbc6",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
    marginBottom: 20,
  },
});
