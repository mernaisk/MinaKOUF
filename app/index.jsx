import "@tamagui/core/reset.css";
import { useState } from "react";
import { Button, H1, View, XStack } from "tamagui";
import CustomButton from "../components/CustomButton";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router'


export default function index() {
  const router = useRouter();

  return (
    <SafeAreaView>
      <XStack gap="$2" padding="$5">
        {/* <Button  theme="green" onPress={() => setCount(count + 1)} flex={1} > increment */}
          <Button theme="orange" onPress={() => router.push({pathname:"/KOUF"})}>KOUF</Button>
          {/* <Link href={{pathname:'Youth'}}> <Button theme="orange">Youth</Button></Link>
          <Link href={{pathname:'Youth'}}> <Button theme="orange">test</Button></Link> */}

      </XStack>

    </SafeAreaView>
  );
}
