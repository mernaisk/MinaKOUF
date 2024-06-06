import { View, Text } from 'react-native'
import React from 'react'
import PhoneInput from 'react-native-phone-number-input'

const phoneInput = ({ onChange, value ='', isDisabled }) => {

  return (
    <View>
      <PhoneInput
            disabled={isDisabled}
            placeholder="enter you phone number"
            defaultValue={value}
            defaultCode="se"
            layout="first"
            onChangeText={onChange}
            onChangeFormattedText={onChange}
            withDarkTheme
            withShadow
            autoFocus
          />
    </View>
  )
}

export default phoneInput