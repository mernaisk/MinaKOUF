import React from 'react';
import { View, Text } from 'react-native';
import { Input } from 'tamagui';

const tamaguiInput = ({ onChange, value, placeholder, isDisabled }) => {
  return (
    <View style={{ marginBottom: 10 }}>
      <Input
        size="$3"
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        disabled={isDisabled}
        autoCapitalize="words"
      />
    </View>
  );
};

export default tamaguiInput;
