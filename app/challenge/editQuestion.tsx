import React, { useState, useEffect } from "react";
import { TextInput, Button, RadioButton, IconButton } from "react-native-paper";
import { View, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Challenge } from "@/hooks/Challenge";
import { Loading } from "@/components/loading";
import BackButton from "@/components/BackButton";
import { QuestionInfo, RootStackParamList } from "@/constants/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateChallengeInOneChurch } from "@/firebase/firebaseModelChallenge";

const EditQuestion = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: existingQuestionData, isLoading } = Challenge();
  const [question, setQuestion] = useState(
    existingQuestionData?.Question || ""
  );
  const [choices, setChoices] = useState(
    existingQuestionData?.Choices
      ? JSON.parse(JSON.stringify(existingQuestionData.Choices))
      : []
  );
  const [isChanged, setIsChanged] = useState(false);
  const queryClient = useQueryClient();

  const updateQuestionMutation = useMutation({
    mutationFn: (data: QuestionInfo) => {
      if (!existingQuestionData) {
        throw new Error("No existing question data available.");
      }
      return UpdateChallengeInOneChurch(
        data,
        existingQuestionData.OrgnizationId
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["Question", existingQuestionData?.OrgnizationId],
      });
      setIsUpdating(false);
      navigation.goBack();
    },
    onError: (error) => {
      Alert.alert("Something went wrong, try again. Error:" + error);
      setIsUpdating(false);
    },
  });

  const updateQuestion = (newQuestion: any) => {
    setQuestion(newQuestion);
  };

  const addChoice = () => {
    const updatedChoices = [...choices, { choiceText: "", answer: false }];
    setChoices(updatedChoices);
  };

  const deleteChoice = (index: number) => {
    const updatedChoices = choices.filter((_: any, i: any) => i !== index);
    setChoices(updatedChoices);
  };

  const updateChoiceText = (text: string, index: number) => {
    const updatedChoices = [...choices];
    updatedChoices[index].choiceText = text;
    setChoices(updatedChoices);
    console.log(choices);
  };

  const updateChoiceAnswer = async (value: boolean, index: number) => {
    const updatedChoices = [...choices];
    updatedChoices[index].answer = value;
    setChoices(updatedChoices);
  };

  // Save changes
  const saveChanges = async () => {
    if (!existingQuestionData) {
      Alert.alert("No existing question data available.");
      return;
    }
    const newData: QuestionInfo = {
      Question: question,
      Choices: choices,
      AnswerdCorrect: existingQuestionData.AnswerdCorrect,
      AnswerdWrong: existingQuestionData.AnswerdWrong,
      OrgnizationId: existingQuestionData.OrgnizationId,
    };
    setIsUpdating(true);
    updateQuestionMutation.mutate(newData);
  };


  const handleBackPress = () => {
    if (isChanged) {
      setIsAlertVisible(true);
    } else {
      navigation.goBack();
    }
  };
  useEffect(() => {
    // Re-evaluate isChanged whenever question or choices changes
    const questionChanged = question !== existingQuestionData?.Question;
    const choicesChanged =
      JSON.stringify(choices) !== JSON.stringify(existingQuestionData?.Choices);
    console.log("new: ", choices);
    console.log("old: ", existingQuestionData?.Choices);

    setIsChanged(questionChanged || choicesChanged);
  }, [question, choices, existingQuestionData]);
  
  if (isLoading || isUpdating) {
    return <Loading />;
  }
  return (
    <SafeAreaView>
      <BackButton handleBackPress={handleBackPress} />

      <TextInput
        label="Question"
        value={question}
        onChangeText={(text) => updateQuestion(text)}
      />

      <FlatList
        data={choices}
        renderItem={({ item, index }) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <RadioButton.Group
              onValueChange={(newValue) =>
                updateChoiceAnswer(newValue === "true", index)
              }
              value={item.answer ? "true" : "false"}
            >
              <RadioButton.Item label="True" value="true" />
              <RadioButton.Item label="False" value="false" />
            </RadioButton.Group>

            <TextInput
              style={{ flex: 1 }}
              label={`Choice ${index + 1}`}
              value={item.choiceText}
              onChangeText={(text) => updateChoiceText(text, index)}
            />

            <IconButton
              icon="delete"
              size={20}
              onPress={() => deleteChoice(index)}
            />
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      />

      <Button mode="contained" onPress={addChoice} style={{ marginTop: 10 }}>
        Add Choice
      </Button>

      <Button
        mode="contained"
        onPress={saveChanges}
        disabled={!isChanged}
        style={{ marginTop: 20 }}
      >
        Save Changes
      </Button>
      <AwesomeAlert
        show={isAlertVisible}
        title="Unsaved Changes"
        titleStyle={{ fontSize: 28, color: "black" }}
        message="You have unsaved changes. Are you sure you want to leave without saving?"
        messageStyle={{ color: "grey", fontSize: 20 }}
        showCancelButton={true}
        cancelText="Cancel"
        cancelButtonStyle={{ backgroundColor: "black" }}
        cancelButtonTextStyle={{ color: "grey" }}
        onCancelPressed={() => {
          setIsAlertVisible(false);
        }}
        showConfirmButton={true}
        confirmText="Leave"
        confirmButtonStyle={{ backgroundColor: "black" }}
        confirmButtonTextStyle={{ color: "grey" }}
        onConfirmPressed={() => {
          setIsAlertVisible(false);
          navigation.goBack();
        }}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
      />
    </SafeAreaView>
  );
};

export default EditQuestion;
