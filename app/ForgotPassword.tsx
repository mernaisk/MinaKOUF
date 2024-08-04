import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/firebase/firebaseModel";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import InputController from "@/components/InputController";
import { checkEmail } from "@/scripts/utilities";
import BackButton from "../components/BackButton";

const ForgotPassword = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, setError } = useForm({
    defaultValues: {
      Email: "",
    },
  });

  const ForgotPasswordMutation = useMutation({
    mutationFn: (data) => resetPassword(data),
    onError: (error) => {
      setIsLoading(false);
      Alert.alert("Failed to send email, please check your email");
    },
    onSuccess: () => {
      setIsLoading(false); // Stop loading
      Alert.alert("Success", "Password reset email sent successfully.");
      navigation.navigate("Index");
    },
  });

  async function onSubmit(data: any) {
    ForgotPasswordMutation.mutate(data.Email);
    console.log("data is ", data);
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
            <Image
              source={require("../assets/images/ForgotPassword.webp")}
              style={styles.image}
            />
            {/* <View style={styles.inputContainer}> */}
            {/* <Image source={emailIcon} style={styles.icon} /> */}
            <InputController
              name="Email"
              control={control}
              rules={{
                required: "Email is required.",
                validate: (value: any) => checkEmail(value) || "Invalid email.",
              }}
              placeholder="Email"
              autoCompleteType="email"
              keyboardType="email-address"
              secureTextEntry={false}
            />
            {/* </View> */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#decbc6",
    // alignItems: 'center',
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 380,
    resizeMode: "contain",
    marginBottom: 0,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingLeft: 10,
    elevation: 3, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  button: {
    marginHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "black",
    borderRadius: 8,
    alignItems: "center",
    elevation: 3, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
