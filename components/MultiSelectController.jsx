import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import React from 'react'
import { useController } from 'react-hook-form'
import { MultiSelect } from 'react-native-element-dropdown';
import { AntDesign } from '@expo/vector-icons';

const MultiSelectController = ({name, control, rules, defaultValue = '', ...props}) => {

  const {
    field: {onChange,onBlur, value},
    fieldState: {error}
  } = useController({
    name,
    control, 
    rules,
    defaultValue
  });

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      </View>
    );
  };

  // console.log("props.data:", props.data);
  return (
      <View>
        <MultiSelect
          {...props}
          onBlur={onBlur}
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          labelField="label"
          valueField="value"
          value={value}
          onChange={onChange}
          maxHeight={200}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color="black"
              name="Safety"
              size={20}
            />
          )}
          renderItem={renderItem}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity onPress={() => unSelect && unSelect(item)} key={item.value}>
              <View style={styles.selectedStyle}>
                <Text style={styles.textSelectedStyle}>{item.label}</Text>
                <AntDesign color="black" name="delete" size={17} />
              </View>
            </TouchableOpacity>
          )}
        />
        {error && <Text style={styles.errorText}>{error.message}</Text>}
      </View>
  )
}

export default MultiSelectController

const styles = StyleSheet.create({
  errorText: {
    color: "black",
    marginTop: 5,
    fontStyle: "italic",
    marginBottom: 10,
    textAlign: "center", // Center the text
  },
  container: { padding: 16 },
  dropdown: {
    height: 50, 
    width: "90%", 
    backgroundColor: "#f2e9e4", 
    borderRadius: 10, 
    paddingVertical: 10, 
    paddingHorizontal: 10, 
    textAlign: "center", 
    alignSelf: "center", 
    justifyContent: "center", 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginTop:20
  },
  placeholderStyle: {
    fontSize: 16, // Match TextInput placeholder font size
    color: "#888888", // Match TextInput placeholder color
    textAlign: "center", // Center placeholder text
  },
  selectedTextStyle: {
    fontSize: 16, // Match TextInput font size
    color: "black", // Match TextInput text color
    textAlign: "center", // Center selected text
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    backgroundColor: '#f2e9e4', // Match TextInput background color
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#f2e9e4', // Match TextInput background color
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 3,
    paddingHorizontal: 5,
    paddingVertical: 8,
    marginHorizontal: '15%', // Add horizontal margin to create space on both sides
    marginBottom:10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
});
