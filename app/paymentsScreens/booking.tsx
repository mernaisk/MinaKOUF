import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ChurchInfo, RootStackParamList } from "@/constants/types";
import { useUser } from "@/context/userContext";
import { useQuery } from "@tanstack/react-query";
import { getOneDocInCollection } from "@/firebase/firebaseModel";
import { Loading } from "@/components/loading";
import OneSelectController from "@/components/OneSelectController";
import { useForm } from "react-hook-form";
import InputController from "@/components/InputController";
type BookingPageRouteProp = RouteProp<RootStackParamList, "Booking">;

const Booking = () => {
  const { user, userInfo } = useUser();
  const route = useRoute<BookingPageRouteProp>();
  const { BookingInfo }: any = route.params;
  console.log(BookingInfo);
  const {
    data: OrginizationInfo,
    isLoading: isLoading2,
    error,
    isSuccess,
  } = useQuery<ChurchInfo | null>({
    queryFn: async () => {
      const OrgInfo: any = getOneDocInCollection(
        "Churchs",
        BookingInfo?.churchID
      );

      if (!OrgInfo) {
        throw new Error("Church information not found.");
      }

      return OrgInfo;
    },
    queryKey: ["Orginization", BookingInfo?.churchID],
  });

  const { control, watch } = useForm({
    defaultValues: {
      PaymentMethod: {
        Name: "",
        Id: "",
      },
    },
  });
  if (isLoading2) {
    return <Loading></Loading>;
  }
  const watchedValues = watch();
  console.log(watchedValues);
  return (
    <SafeAreaView>
      <Text>booking</Text>
      <Text>Name: {userInfo.Name}</Text>
      <Text>Payment for: {BookingInfo?.paymentDetails?.type}</Text>
      <Text>Amount: {BookingInfo?.amount}</Text>
      <Text>Recieved by: {OrginizationInfo?.Name}</Text>

      <OneSelectController
        control={control}
        name={"PaymentMethod"}
        rules={{ required: "Please choose one Payment Method" }}
        items={[
          { Name: "Swish", Id: "Swish" },
          { Name: "Kontant", Id: "Kontant" },
        ]}
        title={"Choose one payment method"}
        disabled={undefined}
      />

      {/* <OneSelectController
        name={"CashRecievedBy"}
        control={undefined}
        rules={{
          validate: (name: any) => {},
        }}
        disabled={watchedValues.PaymentMethod.Name !== "Kontant"}
        items={undefined}
        title={"Which Leader have you paied for"}
      /> */}
    </SafeAreaView>
  );
};

export default Booking;

const styles = StyleSheet.create({});
