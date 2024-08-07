import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useController } from 'react-hook-form';

const ImagePickerControl = ({ name, control, rules }) => {
  const { field, fieldState: { error } } = useController({
    name,
    control,
    rules,
  });

  const [image, setImage] = useState(field.value);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access gallery is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setImage(selectedImage);
      field.onChange(selectedImage);
    }
  };

  const deletePhoto = () => {
    setImage(null);
    field.onChange(null);
  };

  return (
    <View style={styles.container}>
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={styles.imagePreview}
          resizeMode="cover"
        />
      )}
      {image && (
        <TouchableOpacity onPress={deletePhoto}>
          <Text style={styles.deleteText}>Delete Photo</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={pickImage}>
        <Text style={styles.pickText}>Choose Photo</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

export default ImagePickerControl;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imagePreview: {
    width: 300,
    height: 300,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  deleteText: {
    color: 'red',
    marginBottom: 10,
  },
  pickText: {
    color: 'blue',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});
