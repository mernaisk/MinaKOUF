import {
  Platform,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useController } from "react-hook-form";

const SelectDateControl = ({ name, control, defaultValue = "", rules }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isPickerShown, setIsPickerShown] = useState(false);

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  function toggleIsPickerShown() {
    console.log("Picker is shown:", isPickerShown);
    setIsPickerShown(!isPickerShown);
  }

  const onChange = (event, date) => {
    const currentDate = date || selectedDate;
    setSelectedDate(currentDate);
    // setShownDate(currentDate.toDateString());
    field.onChange(currentDate);
    if (Platform.OS !== "ios") {
      setIsPickerShown(false);
    }
  };
  const renderDateInput = () => {
    if (Platform.OS === "android") {
      return (
        <Pressable onPress={toggleIsPickerShown}>
          <TextInput
            editable={false}
            value={formattedDate}
            placeholder="Select Date"
            style={[styles.input, error ? styles.inputError : null]}
            placeholderTextColor="#7d8597"

          />
        </Pressable>
      );
    }

    if (Platform.OS === "ios") {
      return (
        <TextInput
        editable={false}
        onPressIn={toggleIsPickerShown}
        value={formattedDate}
        placeholder="Select Date"
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor="#7d8597"

      />
      );
    }
  };
  const formattedDate = field.value ? field.value.toDateString() : "";

  return (
    <TouchableWithoutFeedback onPress={() => setIsPickerShown(false)}>

    <View style={styles.container}>
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View> */}
            {renderDateInput()}

            {isPickerShown && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={selectedDate}
                onChange={onChange}
                maximumDate={new Date()}
              />
            )}

            {isPickerShown && Platform.OS === "ios" && (
              <View style={styles.buttonsView}>
                <TouchableOpacity
                  style={styles.pickerButtons}
                  onPress={toggleIsPickerShown}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.pickerButtons}
                  onPress={() => {
                    toggleIsPickerShown();
                    field.onChange(selectedDate);
                  }}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
          {error && <Text style={styles.errorText}>{error.message}</Text>}

          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>

  );
};

export default SelectDateControl;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: "100%",
    alignItems: "center", 
  },

  buttonsView: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  pickerButtons: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 10,
    marginHorizontal:20,
    marginBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#11182711",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#075985",
  },
  errorText: {
    color: "red",
    marginTop: 5,
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
    marginHorizontal: 20, // Add margin to prevent text from touching edges  
  },
  input: {
    backgroundColor: "#f2e9e4",
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: "90%",
    height: 50,
    textAlign: "center",
    borderRadius: 10,
    color: "#4a4e69",
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
});
