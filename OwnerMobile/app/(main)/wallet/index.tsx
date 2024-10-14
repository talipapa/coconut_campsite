import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import MainHeader from '@/components/MainHeader'
import ContentBody from '@/components/ContentBody'

const index = () => {
  return (
    <ScrollView>
      <MainHeader/>
      <ContentBody>
        <Text>Wallet screen</Text>
      </ContentBody>
    </ScrollView>
  )
}

export default index