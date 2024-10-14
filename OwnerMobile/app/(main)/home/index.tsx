import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainHeader from '@/components/MainHeader'
import { ScrollView } from 'react-native'
import ContentBody from '@/components/ContentBody'

const index = () => {
  return (
    <ScrollView>
      <MainHeader/>
      <ContentBody>
        <Text>Home screen</Text>
      </ContentBody>
    </ScrollView>
  )
}

export default index