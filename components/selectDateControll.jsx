import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from "@react-native-community/datetimepicker";
import InputController from './InputController';

const selectDateControll = (name, control, rules) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [shownDate, setShowenDate] = useState("");
    const [isPickerShowen, setIsPickerShowen] = useState(false);

      
  function toggleIsPickerShown() {
    setIsPickerShowen(!isPickerShowen);
  }

  // const onChange = (type, selectedDate) => {
  //   if (type == "set") {
  //     // toggleIsPickerShown();
  //     setSelectedDate(selectedDate);
  //     if (Platform.OS === "android") {
  //       toggleIsPickerShown();
  //       setShowenDate(selectedDate.toDateString());
  //     }
  //   } else {
  //     toggleIsPickerShown();
  //   }
  // };

  const renderDateInput = () => {
    if (Platform.OS === "android") {
      return (
        <Pressable onPress={toggleIsPickerShown}>
          <InputController
            // { ...inputProps}
            name="date"
            control={control}
            rules={{
              required: "Date is required.",
            }}
          />
        </Pressable>
      );
    }

    if (Platform.OS === "ios") {
        return (
            <InputController
              name="date"
              control={control}
              rules={{
                required: "Date is required.",
              }}
              // { ...inputProps}
              // onPressIn={toggleIsPickerShown}
            />
        );
      }
  };
  return (
    <View>
            {/* {renderDateInput()} */}

            {/* {isPickerShowen && (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={selectedDate}
          onChange={onChange}
          maximumDate={new Date()}
        />
      )} */}

      {/* {isPickerShowen && Platform.OS === "ios" && (
        <View style={styles.buttonsView}>
          <TouchableOpacity
            style={styles.pickerButtons}
            onPress={toggleIsPickerShown}
          >
            <Text style={styles.buttonText}>cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pickerButtons}
            onPress={() =>{
                toggleIsPickerShown();
                setShowenDate(selectedDate.toDateString());
            }}
          >
            <Text style={styles.buttonText}>confirm</Text>
          </TouchableOpacity>
        </View>
      )} */}
    </View>
  )
}

export default selectDateControll

const styles = StyleSheet.create({
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
        marginBottom: 15,
        paddingHorizontal: 20,
        backgroundColor: "#11182711",
      },
      buttonText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#075985",
      },
})