import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ScreenWrapper from "./ScreenWrapper";
import InputController from "@/components/InputController";
import { useMutation } from "@tanstack/react-query";
import {
  logInEmailAndPassword,
  resetPassword,
} from "../firebase/firebaseModel";
import { Loading } from "@/components/loading";
import { useNavigation } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";
import BackButton from "@/components/BackButton";
import { SafeAreaView } from "react-native-safe-area-context";

const LogIn = ({ navigation }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  async function onSubmit(data:any) {
    setError(null);
    mutationUpdate.mutate(data);
  }

  const mutationUpdate = useMutation({
    mutationFn: logInEmailAndPassword,
    onMutate: () => {
      setIsUpdating(true);
    },
    onError: (error:any) => {
      console.error("Error logging in:", error);
      setError(error.message);
      setIsUpdating(false);
    },
    onSuccess: () => {
      setIsUpdating(false);
      // navigation.navigate("Home")
    },
  });

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
        <BackButton handleBackPress={handleBackPress} />
        <Image
          source={require('../assets/images/login4.webp')} // Replace with your image path
          style={styles.image}
        />
        <InputController
          name="Email"
          control={control}
          rules={{
            required: "Email is required.",
          }}
          placeholder="Email"
          autoCompleteType="email"
          keyboardType="email-address"
          secureTextEntry={false}
          style={styles.input}
        />

        <InputController
          name="Password"
          control={control}
          rules={{
            required: "Password is required.",
          }}
          placeholder="Password"
          secureTextEntry={true}
          style={styles.input}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotButtonText}>Forgot your password?</Text>
        </TouchableOpacity>

        {isUpdating && <Loading />}
        </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LogIn;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#decbc6",
    padding: 20,
    justifyContent: 'center', // Center items vertically
  },
  image: {
    width: "100%",
    height: 380,
    resizeMode: "contain",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%', // Ensure it spans the full width of its container
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  buttonContainer: {
    alignItems: 'center', // Center horizontally
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: '90%', // 90% width
  },
  loginButtonText: {
    color: "white",
    fontSize: 20,
  },
  forgotButton: {
    marginVertical: 10,
    alignItems: "center",
  },
  forgotButtonText: {
    color: "black", // Black text color
    fontSize: 16,
  },
});
