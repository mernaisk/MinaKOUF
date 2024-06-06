import { TextInput, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const SearchField = ({value,placeholder,handleValueChange}) => {
  return (
    <SafeAreaView>
      <TextInput
      // style={styles.searchText}
      value={value}
      placeholder={placeholder}
      onChangeText={handleValueChange}
      />
    </SafeAreaView>
  )
}

export default SearchField

