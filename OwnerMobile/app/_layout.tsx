import { Slot } from 'expo-router'
import GlobalProvider from '@/Context/GlobalProvider';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React from 'react';

const firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
    measurementId: 'YOUR_MEASUREMENT_ID',
  };

const _layout = () => {

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <GlobalProvider>
                    <Slot/>
                    <Toast/>
                </GlobalProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )

    
}

export default _layout