  import React, { useState } from "react";
  import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
  } from "react-native";
  import { useController } from "react-hook-form";
  import { Ionicons } from "@expo/vector-icons";

  const InputController = ({
    name,
    control,
    rules,
    defaultValue = "",
    secureTextEntry,
    ...inputProps
  }) => {
    const {
      field: { onChange, onBlur, value },
      fieldState: { error },
    } = useController({
      name,
      control,
      rules,
      defaultValue,
    });

    const [isPasswordVisible, setPasswordVisible] = useState(false);

    return (
      <View>
        <View style={styles.inputContainer}>
          <TextInput
            {...inputProps}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="words"
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            style={[styles.input, error ? styles.inputError : null]}
            placeholderTextColor="#7d8597"
          />
          {secureTextEntry && (
            <TouchableOpacity
              style={styles.iconContainer}
              onPressIn={() => setPasswordVisible(true)}
              onPressOut={() => setPasswordVisible(false)}
            >
              <Ionicons
                name={!isPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="White"
              />
            </TouchableOpacity>
          )}
        </View>
        {error && <Text style={styles.errorText}>{error.message}</Text>}
      </View>
    );
  };

  export default InputController;

  const styles = StyleSheet.create({
    inputContainer: {
      // position: "relative",
      marginTop: 20,
      width: "100%",
      alignItems: "center", // Center the content horizontally
    },
    input: {
      backgroundColor: "#f2e9e4",
      fontSize: 18,
      paddingVertical: 10,
      paddingHorizontal: 10, // Add padding to ensure the text doesn't overlap with the icon
      width: "90%", // Specific width
      height: 50, // Specific height
      textAlign: "center", // Center the text
      borderRadius: 10,
      color: "#4a4e69", // Change this to your desired text color
    },
    iconContainer: {
      position: "absolute",
      right: "10%",
      top: "50%", // Vertically center the icon
      transform: [{ translateY: -12 }], // Adjust the vertical alignment
    },
    inputError: {
      borderBottomColor: "red",
    },
    errorText: {
      color: "black",
      marginTop: 5,
      fontStyle: "italic",
      marginBottom: 20,
      textAlign: "center", // Center the text
    }
  });
