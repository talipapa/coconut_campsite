import { View, Text, SafeAreaView } from 'react-native'
import { ReactNode } from 'react'
import React from "react";

import { ScrollView } from 'react-native'

const ContentBody = ({ children, containerClass }: { children: ReactNode, containerClass?: string }) => {
  return (
    <SafeAreaView className={`mx-5 my-6 ${containerClass}`}>
        {children}
    </SafeAreaView>
  )
}

export default ContentBody