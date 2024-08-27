import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import CheckBox from "react-native-check-box";
import { useController } from "react-hook-form";

const MultiSelectController = ({ control, name, rules, items, title, disabled }) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    control,
    name,
    rules,
  });

  const [isSelected, setIsSelected] = useState([]);

  const handleSelectItem = (item) => {
    const isSelectedItems = isSelected.find((it) => it.Id === item.Name);
    const updatedSelection = isSelectedItems
      ? isSelected.filter((it) => it.Id !== item.Name)
      : [...isSelected, { Name: item.Name, Id: item.Name }];

    onChange(updatedSelection);
  };

  useEffect(() => {
    setIsSelected(value);
  }, [value]);

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
              isChecked={isSelected.some((it) => it.Id === item.Name)}
              rightText={item.Name}
              disabled={disabled} // Disable checkbox if disabled prop is true
              rightTextStyle={disabled ? styles.disabledText : undefined}
            />
          </View>
        ))}
        <Text style={styles.selectedText}>
          Selected Items: {isSelected.map((it) => it.Name).join(", ")}
        </Text>
      </View>
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

export default MultiSelectController;

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
  selectedText: {
    marginVertical: 15,
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
