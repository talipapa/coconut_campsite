import { Slot } from 'expo-router'
import GlobalProvider from '@/Context/GlobalProvider';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React from 'react';

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