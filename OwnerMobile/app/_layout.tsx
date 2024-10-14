import { View, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Slot, Stack, useRootNavigationState, router } from 'expo-router'
import { loadUser } from '@/utils/AuthService';
import GlobalProvider from '@/Context/GlobalProvider';

const _layout = () => {

    const rootNavigationState = useRootNavigationState()
    const navigatorReady = rootNavigationState?.key != null
        
    return (
        <GlobalProvider>
            <Slot/>
        </GlobalProvider>
    )
}

export default _layout