import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputController from "@/components/InputController";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { AddChurchFirebase } from "@/firebase/firebaseModel";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/types";
import BackButton from "@/components/BackButton";
import { Loading } from "@/components/loading";

const AddChurch = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const addChurch = useMutation<any, unknown, any>({
    mutationFn: (data) => {
      setIsUpdating(true); // Start loading
      return AddChurchFirebase(data);
    },

    onError: (error: any) => {
      setIsUpdating(false); // Stop loading

      Alert.alert("Technical wrong, try again");
    },

    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["churchs"] });
      setIsUpdating(false); // Stop loading
      handleBackPress();
    },
  });
  function onSubmit(data: any) {
    console.log(data);
    addChurch.mutate(data);
  }

  function handleBackPress() {
    navigation.goBack();
  }
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={{ flex: 1 }}
            automaticallyAdjustKeyboardInsets={true}
          >
            <BackButton handleBackPress={handleBackPress}></BackButton>

            <InputController
              name="Name"
              control={control}
              rules={{
                required: "Name is required.",
                // pattern: {
                //   value: /^[a-zA-ZöäåÖÄÅ\s]+$/,
                //   message: "This input is letters only.",
                // },
                maxLength: {
                  value: 20,
                  message: "This input exceed maxLength.",
                },
              }}
              placeholder="Church name"
              autoCompleteType="name"
              keyboardType="default"
              secureTextEntry={false}
            />
            <InputController
              name="StreetName"
              control={control}
              rules={{
                required: "Street name is required.",
                pattern: {
                  value: /^[a-zA-ZöäåÖÄÅ\s\d]+$/,
                  message: "letters, digits and spaces only. inga symboler",
                },
              }}
              placeholder="Street Name"
              autoCompleteType="street-address"
              keyboardType="default"
              secureTextEntry={false}
            />

            <InputController
              name="PostNumber"
              control={control}
              rules={{
                required: "Post number is required.",
                pattern: {
                  value: /\d{5}/,
                  message: "Invalid post number. It should be 5 digits.",
                },
              }}
              placeholder="Post number"
              autoCompleteType="postal-code"
              keyboardType="phone-pad"
              secureTextEntry={false}
            />

            <InputController
              name="City"
              control={control}
              rules={{
                required: "City is required.",
                pattern: {
                  value: /^[a-zA-ZöäåÖÄÅ\s]+$/,
                  message: "letters only.",
                },
              }}
              placeholder="City"
              secureTextEntry={false}
            />

            <InputController
              name="SwishNumber"
              control={control}
              rules={{
                required: "Swish number is required.",
              }}
              placeholder="Swish number"
              secureTextEntry={false}
            />

            <InputController
              name="OrganisationNr"
              control={control}
              rules={{
                required: "Orginization number is required.",
              }}
              placeholder="Orginization number"
              secureTextEntry={false}
            />

            <InputController
              name="BankgiroNumber"
              control={control}
              rules={{
                required: "Bankgiro is required.",
              }}
              placeholder="Bankgiro"
              secureTextEntry={false}
            />

            <TouchableOpacity
              style={styles.memberItem}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.buttonText}>Add church</Text>
            </TouchableOpacity>
            {isUpdating && <Loading></Loading>}

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddChurch;

const styles = StyleSheet.create({
  memberItem: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#decbc6",
  },
  buttonText: {
    flex: 1,
    color: "black",
    textAlign: "center",
    fontSize: 30,
  },
});
