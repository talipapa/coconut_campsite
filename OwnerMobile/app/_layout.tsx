import { View, Text } from 'react-native'
import React, { useContext, useState } from 'react'
import { Slot, Stack } from 'expo-router'
import AuthContext from '@/Context/AuthProvider'
import AuthProvider from "@/Context/AuthProvider";

const _layout = () => {
    const [ user, setUser ] = useState({
        email: "John Davila"
    })

    return (
        <AuthProvider.Provider value={{ user: user, setUser: setUser }}>
            <Stack>
                <Stack.Screen name="index" options={{
                    headerShown: false,    
                }} 
                />
                <Stack.Screen name="(main)" options={{
                    headerShown: false
                }} />
                <Stack.Screen name="(auth)" options={{
                    headerShown: false
                }} />
            </Stack>
        </AuthProvider.Provider>
    )
}

export default _layout