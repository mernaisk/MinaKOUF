import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AddChurchFirebase, getAllDocInCollection } from '@/firebase/firebaseModel'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '@/constants/types'
import { useForm } from 'react-hook-form'
import InputController from '@/components/InputController'
import { useChurch } from '@/context/churchContext'
import BackButton from '@/components/BackButton'

const Churchs = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [newChurchName, setNewChurchName] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const queryClient = useQueryClient();
  const {setChurchName } = useChurch();

  const {data: churchsNames, isLoading} = useQuery({
    queryFn: () => getAllDocInCollection("Churchs"),
    queryKey: ["churchs"]
  })

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
      queryClient.refetchQueries({queryKey: ["churchs"]})
      setIsUpdating(false); // Stop loading
    },

  });

  function onSubmit(data:any){
    console.log(data)
    addChurch.mutate(data)
  }

  function handleBackPress(){
    navigation.goBack()
  }
  console.log(churchsNames)
  return (
    <SafeAreaView>
      <BackButton handleBackPress={handleBackPress}></BackButton>
      <FlatList
      data={churchsNames}
      renderItem={({item}:any) => (
        <TouchableOpacity
        style={styles.memberItem}
        onPress={() => {
          setChurchName(item?.lable)
          navigation.navigate("Home")}}
      >
        <Text style={styles.buttonText}>{item.lable}</Text>
      </TouchableOpacity>
      )}
      ListEmptyComponent={() => (
        <View>
          <Text>No items to display</Text>
        </View>
      )}/>
            <InputController
              name="lable"
              control={control}
              rules={{
                required: "Name is required.",
                pattern: {
                  value: /^[a-zA-ZöäåÖÄÅ\s]+$/,
                  message: "This input is letters only.",
                },
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
        <TouchableOpacity
        style={styles.memberItem}
        onPress={handleSubmit(onSubmit)}

      >
        <Text style={styles.buttonText}>add church</Text>
      </TouchableOpacity>

    </SafeAreaView>
  )
}

export default Churchs

const styles = StyleSheet.create({
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2e9e4",
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#726d81",
    width: "70%", // Set the item width to 70% of the screen width
    alignSelf: "center", // Center the item horizontally
  },
  buttonText: {
    flex: 1,
    color: "black",
    textAlign: "center",
    fontSize: 30,
  },
  input: {
    backgroundColor: "#f2e9e4",
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 10, // Add padding to ensure the text doesn't overlap with the icon
    width: "90%", // Specific width
    height: 50, // Specific height
    textAlign: "center", // Center the text
    borderRadius: 10,
    color: "#4a4e69", // Change this to your desired text color
  },
})