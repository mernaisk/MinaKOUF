import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import CheckBox from "react-native-check-box";
import { useController } from "react-hook-form";

const OneSelectController = ({ control, name, rules, items, title, disabled }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
    rules,
  });

  const [isSelected, setIsSelected] = useState({});

  useEffect(() => {
    setIsSelected(field.value);
  }, [field.value]);

  const handleSelectItem = (item) => {
    if (item.Name === isSelected?.Name) {
      setIsSelected({});
      field.onChange({});
    } else {
      field.onChange({ Name: item.Name, Id: item.Name });
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.box, disabled && styles.disabledBox]}>
        {title && (
          <Text style={[styles.title, disabled && styles.disabledTitle]}>
            {title}
          </Text>
        )}
        {items.map((item) => (
          <View key={item.Id} style={styles.checkboxContainer}>
            <CheckBox
              style={[
                styles.checkbox,
                disabled && styles.disabledCheckbox,
              ]}
              onClick={() => !disabled && handleSelectItem(item)} // Prevent interaction if disabled
              isChecked={isSelected?.Name === item.Name}
              rightText={item.Name}
              disabled={disabled} // Disable checkbox if disabled prop is true
              rightTextStyle={disabled ? styles.disabledText : undefined}
            />
          </View>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

export default OneSelectController;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: "center",
    textAlign: "center",
  },
  box: {
    width: "90%",
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
  },
  disabledBox: {
    backgroundColor: "#f0f0f0", // Light grey background when disabled
    borderColor: "#d3d3d3", // Grey border when disabled
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  disabledTitle: {
    color: "#a9a9a9", // Grey text color when disabled
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  checkbox: {
    flex: 1,
  },
  disabledCheckbox: {
    opacity: 0.6, // Reduced opacity when disabled
  },
  disabledText: {
    color: "#a9a9a9", // Grey text color for checkbox label when disabled
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
});
