import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import InputController from "@/components/InputController";
import { addEvent, getChurchInfo } from "@/firebase/firebaseModelEvents";
import { Loading } from "@/components/loading";
import { RootStackParamList } from "@/constants/types";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import SelectDateControl from "@/components/selectDateControll";
import ImagePickerControl from "@/components/ImagePickerControl";
import dayjs from "dayjs";
import BackButton from "@/components/BackButton";
import { ChurchInfo } from "@/constants/types";
import { getOneDocInCollection } from "@/firebase/firebaseModel";
type EventInfosRouteProp = RouteProp<RootStackParamList, "CreateEvent">;

const CreateEvent = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<EventInfosRouteProp>();
  const { EventChurch } = route.params;
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      EventInChurch: "",
      SwishNumber: "",
      ImageInfo: { URL: "", assetInfo: {} },
      StartDate: null, 
    },
  });

  async function refetch() {
    await queryClient.refetchQueries({ queryKey: ["allEvents"] });
  }

  const {
    data: churchInfo,
    isLoading: isLoading2,
    isSuccess,
  } = useQuery<ChurchInfo | null>({
    queryFn: async () => {
      let churchInfo: ChurchInfo | null = null;

      if (EventChurch === "RiksKOUF") {
        const churchDoc = await getOneDocInCollection(
          "RiksKOUFInfo",
          "QCvAYuSRgRVbpbh3tTkb"
        );
        churchInfo = churchDoc ? (churchDoc as ChurchInfo) : null;
      } else {
        churchInfo = await getChurchInfo(EventChurch);
      }

      if (!churchInfo) {
        throw new Error("Church information not found.");
      }

      return churchInfo;
    },
    queryKey: ["church", EventChurch],
  });

  console.log(churchInfo)
  const mutationCreateEvent = useMutation<any, unknown, any>({
    mutationFn: (data) => addEvent(data),

    onError: (error) => {
      setIsUpdating(false);
      Alert.alert("Something went wrong, try again");
      console.error("Error adding document:", error);
    },
    onSuccess: () => {
      refetch();
      setIsUpdating(false);
      navigation.goBack();
    },
  });

  async function onSubmit(data: any) {
    console.log(data);
    setIsUpdating(true);
    mutationCreateEvent.mutate(data);
  }

  function handleBackPress() {
    navigation.goBack();
  }

  useEffect(() => {
    if (churchInfo) {
      reset({
        EventInChurch: churchInfo.Name || "",
        SwishNumber: churchInfo.SwishNumber || "",
      });
    }
  }, [isSuccess]);

  if (isLoading2 || isUpdating) {
    return <Loading />;
  }

  const watchedstartdate:any = watch("StartDate");
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <ScrollView
            style={{ flex: 1 }}
            automaticallyAdjustKeyboardInsets={true}
          >
            <BackButton handleBackPress={handleBackPress}></BackButton>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleSubmit(onSubmit)}
            >
              <Text>Add</Text>
            </TouchableOpacity>

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
                  if (!watchedstartdate || !endDate ) {
                    return "Both start and end dates are required.";
                  }
            
                  const startDayjs = dayjs(watchedstartdate.dateTime, "YYYY-MM-DD HH:mm");
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
                validate: (deadlineDate:any) => {
                  if (!watchedstartdate || !deadlineDate ) {
                    return "Both start and end dates are required.";
                  }
                  const startDayjs = dayjs(watchedstartdate.dateTime, "YYYY-MM-DD HH:mm");
                  const deadlineDayjs = dayjs(deadlineDate.dateTime, "YYYY-MM-DD HH:mm");
            
                  if (deadlineDayjs.isAfter(startDayjs)) {
                    return "Deadline must be earlier than start date.";
                  }
            
                  return true; }
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
  imagePreview: {
    width: 300,
    height: 300,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#726d81",
    // marginBottom: 10,
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
});
