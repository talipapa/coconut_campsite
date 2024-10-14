import { View, Text, SafeAreaView } from 'react-native'
import React, { ReactNode } from 'react'
import { ScrollView } from 'react-native'

const ContentBody = ({ children }: { children: ReactNode }) => {
  return (
    <SafeAreaView className='mx-5 my-6'>
        {children}
    </SafeAreaView>
  )
}

export default ContentBody