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
        <Stack.Screen
            name="caretaker/index"
            options={{
                presentation: 'modal',
                headerTitle: "Caretakers",
                headerTitleStyle:{
                    color: 'white'
                },
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: "#1e3a8a"
                },
            }}
        />
        <Stack.Screen
            name="caretaker/[id]"
            options={{
                presentation: 'modal',
                headerTitle: "Account details",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#5CBCB6"
                },
            }}
        />
        <Stack.Screen
            name="caretaker/add"
            options={{
                presentation: 'modal',
                headerTitle: "Add caretaker",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#5CBCB6"
                },
            }}
        />
        <Stack.Screen
            name="caretaker/change-password/index"
            options={{
                presentation: 'modal',
                headerTitle: "Change caretaker password",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#9e2a2b"
                },
                headerTintColor: 'white'
            }}
        />

        <Stack.Screen
            name="(transaction)/allsuccessful"
            options={{
                presentation: 'modal',
                headerTitle: "Verified bookings",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#5CBCB6"
                },
                headerTintColor: 'black'
            }}
        />

        <Stack.Screen
            name="(transaction)/currentmonth"
            options={{
                presentation: 'modal',
                headerTitle: "Current month",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#5CBCB6"
                },
                headerTintColor: 'black'
            }}
        />
        <Stack.Screen
            name="(transaction)/previousmonth"
            options={{
                presentation: 'modal',
                headerTitle: "Previous month",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#5CBCB6"
                },
                headerTintColor: 'black'
            }}
        />
        <Stack.Screen
            name="(transaction)/cashonly"
            options={{
                presentation: 'modal',
                headerTitle: "Cash only bookings",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#5CBCB6"
                },
                headerTintColor: 'black'
            }}
        />
        <Stack.Screen
            name="(transaction)/ewalletonly"
            options={{
                presentation: 'modal',
                headerTitle: "E-wallet only bookings",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#5CBCB6"
                },
                headerTintColor: 'black'
            }}
        />
        <Stack.Screen
            name="(transaction)/successfulcurrentmonth"
            options={{
                presentation: 'modal',
                headerTitle: "Successful bookings for the current month",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#5CBCB6"
                },
                headerTintColor: 'black'
            }}
        />
        <Stack.Screen
            name="(transaction)/cancelledcurrentmonth"
            options={{
                presentation: 'modal',
                headerTitle: "Cancelled bookings for the current month",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#5CBCB6"
                },
                headerTintColor: 'black'
            }}
        />
        <Stack.Screen
            name="(transaction)/scanned"
            options={{
                presentation: 'modal',
                headerTitle: "Campers scanned in",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#0f172a"
                },
                headerTintColor: 'white'
            }}
        />
    </Stack>
  )
}

export default _layout