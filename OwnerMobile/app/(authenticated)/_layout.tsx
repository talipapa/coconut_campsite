import { View, Text } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'

const _layout = () => {
  return (
    <>
        {/* Header */}
        <Text>This is a layout</Text>
        {/* Body */}
        <Slot/>
        {/* Footer */}
    </>
  )
}

export default _layout