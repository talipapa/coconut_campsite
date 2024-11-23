import { View, Text, ScrollView } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Slot } from 'expo-router'
import React = require("react");



const _layout = () => {
  return (
    <SafeAreaView className='h-full grow items-center justify-end'>
        <Slot/>
    </SafeAreaView>
  )
}

export default _layout