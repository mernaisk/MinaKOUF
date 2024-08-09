import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useController } from "react-hook-form";
import { MultipleSelectList } from "react-native-dropdown-select-list";

const MultiSelectController = ({
  name,
  control,
  rules,
  defaultValue = "",
  ...props
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  const [selected, setSelected] = React.useState([]);
  console.log(selected);

  const data = [
    { value: "Mobiles" },
    { value: "Appliances" },
    { value: "Cameras" },
    { value: "Computers", disabled: true },
    { value: "Vegetables" },
    { value: "Diary Products" },
    { value: "Drinks" },
  ];
  const onChange = (val) => {
    setSelected(val);
    field.onChange(selected);
    console.log(field.value);
  };
  return (
    <View>
      <MultipleSelectList
        {...props}
        setSelected={(val) => onChange(val)}
        data={props.data}
        save="value"
        boxStyles={styles.dropdown} // Custom styles
        dropdownStyles={styles.dropdownList} // Custom dropdown styles
        dropdownShown={false}
        
      />
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

export default MultiSelectController;

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    marginTop: 5,
    fontStyle: "italic",
    marginBottom: 10,
    textAlign: "center",
  },
  dropdown: {
    backgroundColor: "#f2e9e4",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 20,
    width:"90%"
  },
  dropdownList: {
    backgroundColor: "#f2e9e4",
    width:"90%",
    // alignItems:"center",
    // alignContent:"center",
    textAlign: "center",
    alignSelf: "center",  },
});
