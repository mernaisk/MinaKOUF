import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import CheckBox from "react-native-check-box";
import { useController } from "react-hook-form";

const MultiSelectController = ({
  control,
  name,
  rules,
  items,
  title,
  disabled,
}) => {
  const {
    field: { value, onChange }, // Default value to an empty array
    fieldState: { error },
  } = useController({
    control,
    name,
    rules,
  });

  const [isSelected, setIsSelected] = useState([]);
  useEffect(() => {
    setIsSelected(value || []);
  }, [value]);
  const handleSelectItem = (item: any) => {
    const isSelectedItem = isSelected?.some((it: any) => it === item.Id);
    const updatedSelection:any = isSelectedItem
      ? isSelected.filter((it: any) => it !== item.Id)
      : [...isSelected, item.Name];

    onChange(updatedSelection);
    // setIsSelected(updatedSelection); 

  };
  console.log(items)


  return (
    <View style={styles.container}>
      <View style={[styles.box, disabled && styles.disabledBox]}>
        {title && (
          <Text style={[styles.title, disabled && styles.disabledTitle]}>
            {title}
          </Text>
        )}
        {items.map((item: any) => (
          <View key={item.Id} style={styles.checkboxContainer}>
            <CheckBox
              style={[styles.checkbox, item.Disabled && styles.disabledCheckbox]}
              onClick={() => !disabled && handleSelectItem(item)}
              isChecked={isSelected?.some((it: any) => it === item.Id)} // Consistent check with item.Id
              rightText={item.Name}
              disabled={item.Disabled}
              rightTextStyle={item.Disabled ? styles.disabledText : undefined}
            />
          </View>
        ))}
        <Text style={styles.selectedText}>
          Selected Items: {isSelected?.map((it: any) => it).join(", ")}
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
    backgroundColor: "#f0f0f0",
    borderColor: "#d3d3d3",
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
    color: "#a9a9a9",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  checkbox: {
    flex: 1,
  },
  disabledCheckbox: {
    opacity: 0.3,
  },
  disabledText: {
    color: "#a9a9a9",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
});
