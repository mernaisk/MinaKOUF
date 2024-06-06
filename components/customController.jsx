// customController.jsx
import React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { YStack } from 'tamagui';


const customController = ({ control, errors, RegisterName, customRules, renderField , renderFieldProps}) => {
  return (
    <YStack width="100%" maxWidth={300} marginVertical={10}>
    <View>
      <Controller
        // key={key}
        control={control}
        name={RegisterName}
        rules={customRules}
        render={({ field: { onChange, value } }) => renderField({ onChange, value }, renderFieldProps)}
      />

    </View>
    </YStack>

  );
};

export default customController;

