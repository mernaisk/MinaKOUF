import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";

const ScreenWrapper = ({ children }: { children: React.ReactNode }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        enabled
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#decbc6",
  },
});

export default ScreenWrapper;
