import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChurchInfo, RootStackParamList } from '@/constants/types';
import { useQuery } from '@tanstack/react-query';
import { getOneDocInCollection } from '@/firebase/firebaseModel';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useUser } from '@/context/userContext';
import dayjs from 'dayjs';

const YOUTHindex = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {user} = useUser()
  const {
    data: RiksKOUFInfo,
    isLoading: isLoading2,
    error,
    isSuccess,
  } = useQuery<ChurchInfo | null>({
    queryFn: async () => {
      let churchInfo: ChurchInfo | null = null;

        const churchDoc = await getOneDocInCollection(
          "RiksKOUFInfo",
          "QCvAYuSRgRVbpbh3tTkb"
        );

        churchInfo = churchDoc ? (churchDoc as ChurchInfo) : null;

      if (!churchInfo) {
        throw new Error("Church information not found.");
      }

      return churchInfo;
    },
    queryKey: ["RiksKOUFInfo"],
  });
  return (
    <SafeAreaView>
        <Text>Årets utmaning</Text>
        <Text>circle diagram</Text>
        <Text>Veckans utmaning: Correct, wrong, not answered</Text>
        <Text>Question</Text>
        <Text>Choices</Text>

        <Text></Text>
        <Text>Månadsmedlemskap</Text>
        <Text>circle diagram</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Booking", {
              BookingInfo: {
                payerID: user.uid,
                paymentDetails: {
                  type: "membership",
                  eventID: null,
                },
                amount: "100",
                method: {
                  type: null,
                  swishDetails: {
                    swishNumber: RiksKOUFInfo?.SwishNumber,
                    confirmed: null,
                    confirmedBy: null,
                  },
                  cashDetails: {
                    receivedBy: null,
                    confirmed: null,
                    confirmedBy: null,
                  },
                },
                churchID: RiksKOUFInfo?.Name,
                date: dayjs().toDate(),
                status: "Pending",
              },
            })
          }
          style={styles.editButton}
        >
          <Text>Pay Membership</Text>
        </TouchableOpacity>
        <Text></Text>
        <Text>Send suggestion</Text>
        <Text>text input</Text>
        <Text>send button</Text>

        <Text></Text>
        <Text>Send suggestion</Text>
        <Text>text input</Text>
        <Text>send button</Text> 
    </SafeAreaView>
  )
}

export default YOUTHindex

const styles = StyleSheet.create({
  editButton: {
    position: "absolute",
    top: 5,
    right: 15,
    zIndex: 1,
  },
})