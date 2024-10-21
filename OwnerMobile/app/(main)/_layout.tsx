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
        <Stack.Screen
            name="bookings"
            options={{
            presentation: 'modal',
            headerTitle: 'Bookings',
            headerTitleStyle:{
                color: 'white'
            },
            headerStyle: {
                backgroundColor: "#5CBCB6"
            },
        }}/>

        <Stack.Screen
            name="cashout/index"
            options={{
                presentation: 'modal',
                headerTitle: "Cash out",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#5CBCB6"
                },
            }}
        />
        <Stack.Screen
            name="profile/index"
            options={{
                presentation: 'modal',
                headerTitle: "Profile",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#5CBCB6"
                },
            }}
        />
        <Stack.Screen
            name="profile/change-password/index"
            options={{
                presentation: 'modal',
                headerTitle: "Change password",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#5CBCB6"
                },
            }}
        />
    </Stack>
  )
}

export default _layout