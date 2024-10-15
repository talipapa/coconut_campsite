import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen name="(tabs)" options={{
            headerShown: false,
        }}/>
        <Stack.Screen
            name="booking/[id]"
            options={{
            presentation: 'modal',
            headerTitle: 'Details',
            headerTitleStyle:{
                color: 'white'
            },
            headerStyle: {
                backgroundColor: "#5CBCB6"
            }
        }}/>
    </Stack>
  )
}

export default _layout