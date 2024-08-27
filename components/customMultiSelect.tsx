import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomMultiSelect = ({ items, selectedItems, onSelectedItemsChange, placeholder }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSelectItem = (item) => {
    const isSelected = selectedItems.includes(item.id);
    const newSelectedItems = isSelected
      ? selectedItems.filter((id) => id !== item.id)
      : [...selectedItems, item.id];
    onSelectedItemsChange(newSelectedItems);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsDropdownVisible(!isDropdownVisible)}
      >
        <Text style={styles.placeholder}>
          {selectedItems.length > 0
            ? items.filter((item) => selectedItems.includes(item.id)).map((item) => item.name).join(', ')
            : placeholder}
        </Text>
      </TouchableOpacity>
      {isDropdownVisible && (
        <View style={styles.dropdown}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleSelectItem(item)}
              style={[
                styles.item,
                selectedItems.includes(item.id) && styles.selectedItem,
              ]}
            >
              <Text
                style={[
                  styles.itemText,
                  selectedItems.includes(item.id) && styles.selectedItemText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  selector: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 10,
    borderRadius: 5,
  },
  placeholder: {
    color: "#888",
  },
  dropdown: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    backgroundColor: "#FFF",
    padding: 5,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  itemText: {
    color: "#000",
  },
  selectedItem: {
    backgroundColor: "#CCC",
  },
  selectedItemText: {
    fontWeight: "bold",
  },
});

export default CustomMultiSelect;
