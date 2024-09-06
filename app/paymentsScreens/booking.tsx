import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ChurchInfo, RootStackParamList } from '@/constants/types';
import { useUser } from '@/context/userContext';
import { useQuery } from '@tanstack/react-query';
import { getOneDocInCollection } from '@/firebase/firebaseModel';
import { Loading } from '@/components/loading';
type BookingPageRouteProp = RouteProp<RootStackParamList,"Booking">

const Booking = () => {
  const {user,userInfo} = useUser()
  const route = useRoute<BookingPageRouteProp>()
  const {BookingInfo}:any = route.params;
  console.log(BookingInfo)
  const {
    data: OrginizationInfo,
    isLoading: isLoading2,
    error,
    isSuccess,
  } = useQuery<ChurchInfo | null>({
    queryFn: async () => {
      const OrgInfo:any = getOneDocInCollection(
        "Churchs",
        BookingInfo?.churchID
      ) ;
      

      if (!OrgInfo) {
        throw new Error("Church information not found.");
      }

      return OrgInfo;
    },
    queryKey: ["Orginization", BookingInfo?.churchID],
  });

  if(isLoading2){
    return <Loading></Loading>
  }
  return (
    <SafeAreaView>
      <Text>booking</Text>
      <Text>Name: {userInfo.Name}</Text> 
      <Text>Payment for: {BookingInfo?.paymentDetails?.type}</Text>
      <Text>Amount: {BookingInfo?.amount}</Text> 
      <Text>Recieved by: {OrginizationInfo?.Name}</Text> 

 
    </SafeAreaView>
  )
}

export default Booking

const styles = StyleSheet.create({

})