import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Slot } from 'expo-router'

const _layout = () => {
  return (
    <SafeAreaView className='h-full p-7'>
        <Slot/>
    </SafeAreaView>
  )
}

export default _layout