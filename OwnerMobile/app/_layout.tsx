import React from 'react'
import { Slot } from 'expo-router'
import GlobalProvider from '@/Context/GlobalProvider';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const _layout = () => {

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GlobalProvider>
                <Slot/>
                <Toast/>
            </GlobalProvider>
        </GestureHandlerRootView>
    )
}

export default _layout