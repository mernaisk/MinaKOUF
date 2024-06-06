import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const CustomButton = ({title, handlePress, isLoading}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
        activeOpacity={0.7}
        disabled={isLoading}
    >
        <Text>
            {title}
        </Text>

    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  button: {
    backgroundColor:"#deb887",
    borderRadius: 10,
    minHeight: 62,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,  
    marginTop: 20,  
  },
  loading: {
    opacity: 0.5,
  },
});