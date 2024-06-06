import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from 'tamagui'
import { Link , useRouter} from 'expo-router'

//tamagui lucide icon
//size, theme, color, fontweight, icon, scale icon
const KOUF = () => {
  const router = useRouter();

  return (
    <SafeAreaView>
        <Button theme="orange"   >Take attendence</Button>
        <Button theme="orange" >Start KOUF meeting</Button>
        <Button theme="orange"  >Report</Button>
        <Button theme="orange" onPress={() => router.push({pathname:"/allMembers"})}>All Members</Button>
        <Button theme="orange"  >Create events</Button>

    </SafeAreaView>
  )
}

export default KOUF