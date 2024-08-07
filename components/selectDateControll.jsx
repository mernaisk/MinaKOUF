import {
  Platform,
  StyleSheet,
  TextInput,
  View,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from "react-native";
import React, { useState } from "react";
import { useController } from "react-hook-form";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

const SelectDateControl = ({
  name,
  control,
  // defaultValue = { dateTime: "", justDate: "", justTime: "" },
  defaultValue = "",
  rules,
  placeholderDate,
  placeholderTime,
  ...dateProps
}) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isPickerShown, setIsPickerShown] = useState(false);

  const { field, fieldState } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  function toggleIsPickerShown() {
    setIsPickerShown(!isPickerShown);
  }

  const onChange = (date) => {
    const currentDate = date.date || selectedDate;
    setSelectedDate(currentDate);
    const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");
    const formattedTime = dayjs(currentDate).format("HH:mm");
    field.onChange({
      dateTime: currentDate,
      justDate: formattedDate,
      justTime: formattedTime,
    });
    if (Platform.OS !== "ios") {
      setIsPickerShown(false);
    }
  };

  const renderDateInput = () => {
    if (Platform.OS === "android") {
      return (
        <Pressable onPress={toggleIsPickerShown} style={{ width: "45%" }}>
          <TextInput
            editable={false}
            value={field.value?.justDate}
            placeholder={placeholderDate}
            style={[styles.input, fieldState.error ? styles.inputError : null]}
            placeholderTextColor="#7d8597"
          />
        </Pressable>
      );
    }

    if (Platform.OS === "ios") {
      return (
        <View style={{ width: "45%" }}>
          <TextInput
            editable={false}
            onPressIn={toggleIsPickerShown}
            value={field.value?.justDate}
            placeholder={placeholderDate}
            style={[styles.input, fieldState.error ? styles.inputError : null]}
            placeholderTextColor="#7d8597"
          />
        </View>
      );
    }
  };

  const renderTimeInput = () => {
    if (Platform.OS === "android") {
      return (
        <Pressable onPress={toggleIsPickerShown} style={{ width: "45%" }}>
          <TextInput
            editable={false}
            value={field.value?.justTime}
            placeholder={placeholderTime}
            style={[styles.input, fieldState.error ? styles.inputError : null]}
            placeholderTextColor="#7d8597"
          />
        </Pressable>
      );
    }

    if (Platform.OS === "ios") {
      return (
        <View style={{ width: "45%" }}>
          <TextInput
            editable={false}
            onPressIn={toggleIsPickerShown}
            value={field.value?.justTime}
            placeholder={placeholderTime}
            style={[styles.input, fieldState.error ? styles.inputError : null]}
            placeholderTextColor="#7d8597"
          />
        </View>
      );
    }
  };
  console.log(fieldState.error);
  console.log(field.value);

  return (
    <View style={styles.container}>
      <View style={styles.calenderContainer}>
        {isPickerShown && (
          <DateTimePicker
            mode="single"
            date={selectedDate}
            onChange={onChange}
            timePicker={true}
            {...dateProps}
          />
        )}
      </View>
      <View style={styles.inputsContainer}>
        {renderDateInput()}
        {renderTimeInput()}
      </View>

      {fieldState.error && (
        <Text style={styles.errorText}>{fieldState.error.message}</Text>
      )}
    </View>
  );
};

export default SelectDateControl;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  inputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
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
    marginHorizontal: 20,
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
    marginTop: 20,
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
    marginHorizontal: 20,
  },
  input: {
    backgroundColor: "#f2e9e4",
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: 50,
    textAlign: "center",
    borderRadius: 10,
    color: "#4a4e69",
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  calenderContainer: {
    width: "80%",
  },
});
