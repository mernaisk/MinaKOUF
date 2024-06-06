import { StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native'
import React from 'react'
import { useRouter, Link } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import CustomButton from '../components/CustomButton'
import { getAllDocInCollection } from '../firebase/firebaseModel'
import SearchField from '../components/SearchField'
import { filterMembers } from '../scripts/utilities'
import { Spinner, YStack, Button, Input } from 'tamagui'

const allMembers = () => {
    const router = useRouter();
    const [nameToSearch,setNameToSearch] = useState("");

    const { data: allMembers, isLoading} = useQuery({
      queryFn: () => getAllDocInCollection("STMinaKOUFData"),
      queryKey: ["allMembers"],
    });
    if (isLoading) {
      return <YStack><Spinner size="large" color="$green10" /></YStack>;
    }
    
    const filteredMembers = filterMembers(allMembers, nameToSearch);

    console.log(allMembers)
    console.log(filteredMembers)
  return (
    <SafeAreaView>
      <Input 
      size='$2' 
      placeholder='Search for name' 
      value= {nameToSearch} 
      onChangeText= {setNameToSearch} 
      marginTop='$-1'
      autoCapitalize= 'sentences'
      clearButtonMode ='while-editing'
      enterKeyHint='search'
      inputMode='text'/>

      <FlatList
        data= {filteredMembers}
        keyExtractor={(item) => item.Id}
        renderItem={({item}) => 
          <Button theme="orange"  flex={1} onPress={() => router.push({pathname: "/MemberInfo", params: {memberId: item.Id}})}> {item.FirstName}</Button> 
          }
        ListEmptyComponent={() => (<View ><Text>No items to display</Text></View>)}
      >
        
      </FlatList>
    </SafeAreaView>
  )
}

export default allMembers

