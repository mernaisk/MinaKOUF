import React, { useState } from "react";
import { TextInput, Button, RadioButton, IconButton } from "react-native-paper";
import { View, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDocoment, addDocomentWithId } from "@/firebase/firebaseModel";
import { QuestionInfo } from "@/constants/types";
import BackButton from "@/components/BackButton";
import { RootStackParamList } from "@/constants/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useUser } from "@/context/userContext";
import { Loading } from "@/components/loading";

const CreateQuestion = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { userInfo } = useUser();
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState([{ choiceText: "", answer: false }]);
  const [isUpdating, setIsUpdating] = useState(false);
  const addQuestionMutation = useMutation({
    mutationFn: async (data: QuestionInfo) =>
      await addDocoment("Challenge", data),
    mutationKey: ["addQuestion"],
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["Question", userInfo.OrginizationIdKOUF],
      });
      setIsUpdating(false);
      navigation.goBack();
    },
    onError: (error) => {
      Alert.alert("Something went wrong, try again. Error:" + error);
      setIsUpdating(false);
    },
  });
  const addQuestion = async () => {
    if (choices && question) {
      const data: QuestionInfo = {
        Question: question,
        Choices: choices,
        OrgnizationId: userInfo.OrginizationIdKOUF,
        AnswerdCorrect: [],
        AnswerdWrong: [],
      };
      setIsUpdating(true);
      await addQuestionMutation.mutate(data);
    } else {
      Alert.alert("The question or the choices are missing.");
    }
  };

  const addChoice = () => {
    setChoices([...choices, { choiceText: "", answer: false }]);
  };

  const deleteChoice = (ind: number) => {
    const newChoices = choices.filter((_, index) => index !== ind);
    setChoices(newChoices);
  };

  // Update choice text
  const updateChoiceText = (text: string, index: number) => {
    const updatedChoices = [...choices];
    updatedChoices[index].choiceText = text;
    setChoices(updatedChoices);
  };

  // Update answer (true/false) for each choice
  const updateChoiceAnswer = (value: boolean, index: number) => {
    const updatedChoices = [...choices];
    updatedChoices[index].answer = value;
    setChoices(updatedChoices);
  };
  if (isUpdating) {
    return <Loading />;
  }
  return (
    <SafeAreaView>
      <BackButton handleBackPress={() => navigation.goBack()} />
      <TextInput
        label="Question"
        value={question}
        onChangeText={(text) => setQuestion(text)}
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

            {/* Input field for choice text */}
            <TextInput
              style={{ flex: 1 }}
              label={`Choice ${index + 1}`}
              value={item.choiceText}
              onChangeText={(text) => updateChoiceText(text, index)}
            />

            {/* Delete button */}
            <IconButton
              icon="delete"
              size={20}
              onPress={() => deleteChoice(index)}
            />
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      />

      {/* Add choice button */}
      <Button mode="contained" onPress={addChoice} style={{ marginTop: 10 }}>
        Add Choice
      </Button>

      <Button onPress={addQuestion}>Add question</Button>
    </SafeAreaView>
  );
};

export default CreateQuestion;
