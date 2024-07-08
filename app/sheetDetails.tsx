import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { getOneDocInCollection, getAttendedMembers } from '@/firebase/firebaseModel'
import { DocumentData } from 'firebase/firestore';
import { useForm } from 'react-hook-form'


const editSheet = () => {
  const { control, handleSubmit } = useForm();
  const {sheetId} = useLocalSearchParams()
  const { data: sheetDetails, isLoading: isSheetLoading, isError: isSheetError } = useQuery<DocumentData | undefined>({
    queryFn: () => getOneDocInCollection("STMinaKOUFAttendence", sheetId),
    queryKey: ["sheetDetails", sheetId], // Include sheetId in queryKey for proper invalidation
    enabled: !!sheetId, // Ensure the query runs only if sheetId is defined
  });

  const { data: attendedMembers, isLoading: isMembersLoading, isError: isMembersError } = useQuery({
    queryFn: () => getAttendedMembers(sheetId),
    queryKey: ["attendedMembers", sheetId],
    enabled: !!sheetId, // Ensure the query runs only if sheetId is defined
  });

  if(isSheetLoading || isMembersLoading){
    return (
      <view style={styles.loading}><ActivityIndicator size='large' color="#00ff00"/></view>
    )
  }

  const IdsCount = sheetDetails?.IDS ? Object.keys(sheetDetails.IDS).length : 0;
  return (
    <SafeAreaView>
      <View>
        <Text>Date: {sheetDetails?.date}</Text>
      </View>

      <View>
        <Text>Amount attended youth: {IdsCount}</Text>
      </View>


      <View>
      {/* <FlatList>
        data={sheetDetails.IDS}
      </FlatList> */}
      </View>

    </SafeAreaView>
  )
}

export default editSheet

const styles = StyleSheet.create({
  loading: {
    justifyContent:'center',
    alignItems:'center'
  },
    text:{
        justifyContent:'center',
        alignItems:'center'
    }
})