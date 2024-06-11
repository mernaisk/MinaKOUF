import React from 'react';
import { View, Text, TextInput,StyleSheet } from 'react-native';
import { useController } from 'react-hook-form';

const InputController = ({ name, control, rules, defaultValue = '', ...inputProps }) => {
  const {
    field: { onChange, onBlur, value },
    fieldState: { error }
  } = useController({
    name,
    control,
    rules,
    defaultValue
  });

  return (
      <View>
        <TextInput
          {...inputProps}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          autoCapitalize="words"
          style={styles}

        />
        {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
      </View>
  );
};

export default InputController;

const styles = StyleSheet.create({

    top: 80,
    marginTop: 20,
    fontSize: 30,
    backgroundColor: "white",
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 5,

});


