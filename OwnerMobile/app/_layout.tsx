import React from 'react'
import { Slot } from 'expo-router'
import GlobalProvider from '@/Context/GlobalProvider';
import Toast from 'react-native-toast-message';

const _layout = () => {

    return (
        <GlobalProvider>
            <Slot/>
            <Toast/>
        </GlobalProvider>
    )
}

export default _layout