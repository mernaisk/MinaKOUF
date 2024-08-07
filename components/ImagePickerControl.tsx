import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useController } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

const ImagePickerControl = ({ name, control, rules,  defaultValue = {URL:"", assetInfo:{}},
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      ...rules,
      validate: value => value.assetInfo && value.assetInfo.uri ? true : 'Image is required',
    },
    defaultValue,

  });

  const [image, setImage] = useState(field.value);
  const [modalVisible, setModalVisible] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access gallery is required!");
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
      setImage({URL:"", assetInfo:selectedImage});
      field.onChange({URL:"", assetInfo:selectedImage});
    }
    setModalVisible(false);
  };

  const deletePhoto = () => {
    setImage({URL:"", assetInfo:{}});
    field.onChange({URL:"", assetInfo:{}});
    setModalVisible(false);
  };

  console.log(image)
  return (
    <View style={styles.container}>
      <View style={styles.PictureContainer}>
        <View style={styles.Picture}>
          {image?.assetInfo?.uri ? (
            <Image
              source={{ uri: image.assetInfo.uri }}
              style={[styles.imagePreview]}
              resizeMode="cover"
            />
          ) : (
            <Text>No Photo</Text>
          )}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.editIcon}
          >
            <Ionicons name="add-circle-outline" size={50} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {image.assetInfo.uri && (
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={deletePhoto}
                >
                  <Text style={styles.modalButtonText}>Delete Photo</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
                <Text style={styles.modalButtonText}>Change Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

export default ImagePickerControl;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  imagePreview: {
    width: 300,
    height: 300,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    // marginBottom: 10,
  },
  editIcon: {
    position: "absolute",
    bottom: -10,
    right: -10,
    backgroundColor: "#726d81",
    borderRadius: 15,
    padding: 5,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalButton: {
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  PictureContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  Picture: {
    width: 300,
    height: 300,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#726d81",
    position: "relative",
  },
  
});
