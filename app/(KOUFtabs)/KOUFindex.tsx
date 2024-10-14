import React, { useState } from "react";
import { TextInput, Button, RadioButton, IconButton } from "react-native-paper";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "@/constants/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Challenge } from "@/hooks/Challenge";
import { Loading } from "@/components/loading";
import { MembersInOneChurch } from "@/hooks/MembersInOneChurch";

export default function HomeKOUF() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { data: currentQuestion, isLoading: isLoadingChallenge } = Challenge();
  const { data: allMembers, isLoading: isLoadingMembers } =
    MembersInOneChurch();
  const correctAnswers = currentQuestion?.AnswerdCorrect.length || 0;
  const wrongAnswers = currentQuestion?.AnswerdWrong.length || 0;
  const noAnswers: number =
    (allMembers?.length ? allMembers.length : 0) -
    correctAnswers -
    wrongAnswers;

  if (isLoadingChallenge || isLoadingMembers) {
    return <Loading />;
  }

  const renderChoices = (choice: { choiceText: string; answer: boolean }) => {
    return (
      <View style={styles.choiceContainer} key={choice.choiceText}>
        <Text style={styles.choiceText}>{choice.choiceText}</Text>
        <Text
          style={[
            styles.answerText,
            choice.answer ? styles.true : styles.false,
          ]}
        >
          {choice.answer ? "True" : "False"}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <Text>Mmembership</Text>
        <View style={styles.container}>
          {currentQuestion ? (
            <View>
              <Text style={styles.questionText}>
                {currentQuestion.Question}
              </Text>

              {currentQuestion.Choices.map(renderChoices)}

              <View style={styles.resultRow}>
                <Text style={styles.emoji}>😄</Text>
                <Text style={styles.resultText}>{correctAnswers}</Text>

                <Text style={[styles.emoji, styles.iconSpacing]}>😢</Text>
                <Text style={styles.resultText}>{wrongAnswers}</Text>

                <Text style={[styles.emoji, styles.iconSpacing]}>🤔</Text>
                <Text style={styles.resultText}>{noAnswers}</Text>
              </View>

              <Button
                mode="contained"
                onPress={() => navigation.navigate("EditQuestion")}
                style={styles.editButton}
                contentStyle={styles.buttonContent}
              >
                Edit
              </Button>
            </View>
          ) : (
            <Text>No question is added</Text>
          )}

          <Button
            mode="outlined"
            onPress={() => navigation.navigate("CreateQuestion")}
            style={styles.addButton}
            contentStyle={styles.buttonContent}
          >
            Add Question
          </Button>
        </View>

        <Text>länk för suggestions</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  container: {
    padding: 20,
    flex: 1,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },

  choiceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  choiceText: {
    fontSize: 18,
    color: "#444",
    flexShrink: 1,
  },
  answerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  true: {
    color: "green",
  },
  false: {
    color: "red",
  },
  resultContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  correct: {
    color: "green",
    fontWeight: "bold",
  },
  wrong: {
    color: "red",
    fontWeight: "bold",
  },
  noAnswer: {
    color: "#999",
    fontWeight: "bold",
  },
  editButton: {
    marginTop: 20,
    backgroundColor: "#6200ee",
  },
  addButton: {
    marginTop: 10,
    borderColor: "#6200ee",
  },
  buttonContent: {
    paddingVertical: 10,
  },

  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Centers the row content horizontally
    marginBottom: 10,
  },
  emoji: {
    fontSize: 28, // Slightly larger for clear visibility
  },
  iconSpacing: {
    marginLeft: 20, // Space between emojis
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5, // Adds space between emoji and number
  },
});
