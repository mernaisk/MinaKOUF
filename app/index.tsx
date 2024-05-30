import "@tamagui/core/reset.css";
import { useState } from "react";
import { Button, H1, View, XStack } from "tamagui";

export default function Index() {
  const [count, setCount] = useState(0);

  return (
    <View>
      <XStack gap="$2" padding="$5">
        <Button theme="green" onPress={() => setCount(count + 1)} flex={1}>
          Increment
        </Button>
        <Button theme="orange" onPress={() => setCount(count - 1)} flex={1}>
          Decrement
        </Button>
      </XStack>

      <H1 textAlign="center">{count}</H1>
    </View>
  );
}
