import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useController } from 'react-hook-form';
import PhoneInput from 'react-native-phone-number-input';

const PhoneInputController = ({ name, control, rules, defaultValue = '' }) => {
  const phoneInput = useRef(null);

  const {
    field: { onChange, value },
    fieldState: { error }
  } = useController({
    name,
    control,
    rules: {
      ...rules,
      validate: (value) => {
        const isValid = phoneInput.current?.isValidNumber(value);
        return isValid || 'Invalid phone number.';
      },
    },
    defaultValue
  });

  return (
      <View>
        <PhoneInput
          ref={phoneInput}
          defaultValue={value}
          defaultCode="DM"
          layout="first"
          onChangeText={onChange}
          withDarkTheme
          withShadow
          autoFocus
        />
        {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
});

export default PhoneInputController;
